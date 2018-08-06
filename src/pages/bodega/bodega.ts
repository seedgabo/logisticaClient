import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ActionSheetController, ModalController } from "ionic-angular";
import { Api } from "../../providers/api/api";
import { TransPipe } from "../../pipes/trans/trans";
@IonicPage()
@Component({
  selector: "page-bodega",
  templateUrl: "bodega.html"
})
export class BodegaPage {
  bodega: any = null;
  query = "";
  items = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public actionsheet: ActionSheetController,
    public api: Api,
    public modal: ModalController
  ) {
    this.bodega = this.navParams.get("storage");
  }

  ionViewDidLoad() {
    this.getData();
  }

  filter() {
    if (this.query === "") {
      return (this.items = this.bodega.items);
    }
    var q = this.query.toLowerCase();
    this.items = this.bodega.items.filter((i) => {
      return i.item.toLowerCase().indexOf(q) > -1;
    });
  }

  getData(refresher = null) {
    this.api
      .get(`bodegas/${this.bodega.id}?with[]=items.inventarios`)
      .then((data: any) => {
        this.bodega = data;
        if (this.api.objects.bodegas) this.api.objects.bodegas.collection[data.id] = data;
        this.filter();
        if (refresher) {
          refresher.complete();
        }
      })
      .catch((err) => {
        if (refresher) {
          refresher.complete();
        }
        this.api.error(err);
      });
  }

  actions(item) {
    this.actionsheet
      .create({
        title: item.item,
        buttons: [
          {
            text: new TransPipe(this.api).transform("storage.entry"),
            icon: "log-in",
            handler: () => {
              this.gotoTransacction(item, "Entrada");
            }
          },
          {
            text: new TransPipe(this.api).transform("storage.out"),
            icon: "log-out",
            handler: () => {
              this.gotoTransacction(item, "Salida");
            }
          },
          {
            text: new TransPipe(this.api).transform("storage.move"),
            icon: "ios-archive",
            handler: () => {
              this.gotoTransacction(item, "Movimiento");
            }
          },
          {
            text: new TransPipe(this.api).transform("crud.edit") + " " + new TransPipe(this.api).transform("literals.item"),
            icon: "create",
            handler: () => {
              this.gotoItem(item);
            }
          },
          {
            text: new TransPipe(this.api).transform("literals.images"),
            icon: "albums",
            handler: () => {
              this.gotoImages(item);
            }
          },
          {
            text: "cancelar",
            icon: "close",
            role: "cancel",
            handler: () => {}
          }
        ]
      })
      .present();
  }

  gotoImages(item) {
    var modal = this.modal.create("ModalPicturesPage", {
      resource: item,
      bodega: this.bodega
    });
    modal.present();
    modal.onDidDismiss((data) => {});
  }

  gotoTransacction(item, transaccion, qty = 1) {
    var modal = this.modal.create("TransactionPage", {
      item: item,
      transaccion: transaccion,
      bodega: this.bodega,
      quantity: qty
    });
    modal.present();
    modal.onDidDismiss((data) => {
      if (data) {
        this.getData();
      }
    });
  }

  gotoItem(item) {
    var modal = this.modal.create("ItemPage", {
      item: item,
      bodega: this.bodega
    });
    modal.present();
    modal.onDidDismiss((data) => {
      if (data) {
        this.getData();
      }
    });
  }

  gotoTransform() {
    var modal = this.modal.create(
      "TransformPage",
      {
        bodega: this.bodega
      },
      {
        cssClass: "modal-fullscreen"
      }
    );
    modal.present();
    modal.onDidDismiss((data) => {
      if (data) {
        this.getData();
      }
    });
  }

  chooseItem() {
    var modal = this.modal.create("ItemChooserPage", {
      disableds: this.bodega.items.map((i) => {
        return i.pivot.item_id;
      }),
      bodega: this.bodega
    });
    modal.present();
    modal.onDidDismiss((data) => {
      if (data) {
        this.addEntrada(data.item, data.quantity, data.razon);
      }
    });
  }

  addEntrada(item, quantity, razon) {
    var promise = this.api.post(`inventarios/${item.id}/add/${this.bodega.id}`, {
      secure_mode: true,
      quantity: quantity,
      // cliente_id: this.cliente ? this.cliente.id : undefined,
      // entidad_id: this.entidad ? this.entidad.id : undefined,
      razon: razon
    });
    promise
      .then((resp) => {
        this.getData();
      })
      .catch((err) => {
        this.api.error(err);
      });
    return promise;
  }

  actionsAdd() {
    this.actionsheet
      .create({
        title: new TransPipe(this.api).transform("crud.add"),
        buttons: [
          {
            text: new TransPipe(this.api).transform("crud.add") + " " + new TransPipe(this.api).transform("literals.new item"),
            icon: "add",
            handler: () => {
              this.gotoItem(null);
            }
          },
          {
            text: new TransPipe(this.api).transform("crud.add") + " " + new TransPipe(this.api).transform("literals.existing item"),
            icon: "add-circle",
            handler: () => {
              this.chooseItem();
            }
          },
          {
            text: new TransPipe(this.api).transform("crud.add") + " " + new TransPipe(this.api).transform("storage.transform"),
            icon: "repeat",
            handler: () => {
              this.gotoTransform();
            }
          },
          {
            text: "cancelar",
            icon: "close",
            role: "cancel",
            handler: () => {}
          }
        ]
      })
      .present();
  }
}
