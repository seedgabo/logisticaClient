import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ViewController, ModalController, ToastController } from "ionic-angular";
import { Api } from "../../providers/api/api";
@IonicPage()
@Component({
  selector: "page-transaction",
  templateUrl: "transaction.html"
})
export class TransactionPage {
  transaction = {
    transaccion: "Entrada",
    item_id: null,
    quantity: 1,
    razon: "",
    bodega_entrante_id: null,
    bodega_saliente_id: null,
    bodega_entrante: null,
    bodega_saliente: null,
    cliente_id: null,
    entidad_id: null
  };
  bodega = { id: null };
  bodegaDest = null;
  item = null;
  entidad = null;
  cliente = null;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewctrl: ViewController,
    public api: Api,
    public modal: ModalController,
    public toast: ToastController
  ) {
    this.item = this.navParams.get("item");
    this.bodega = this.navParams.get("bodega");
    this.transaction.transaccion = this.navParams.get("transaccion") || "Entrada";
    this.transaction.item_id = this.item.id;
    this.transaction.bodega_entrante_id = this.bodega.id;
    this.transaction.quantity = this.navParams.get("Cantidad") || 1;
  }

  ionViewDidLoad() {
    this.api.load("bodegas");
    this.api.load("clientes");
    this.api.load("entidades");
  }

  addEntrada(quantity, razon) {
    var promise = this.api.post(`inventarios/${this.item.id}/add/${this.bodega.id}`, {
      secure_mode: true,
      quantity: quantity,
      cliente_id: this.cliente ? this.cliente.id : undefined,
      entidad_id: this.entidad ? this.entidad.id : undefined,
      razon: razon
    });
    promise
      .then((resp) => {
        this.dismiss(resp);
      })
      .catch((err) => {
        this.api.error(err);
      });
    return promise;
  }

  addSalida(quantity, razon) {
    var promise = this.api.post(`inventarios/${this.item.id}/remove/${this.bodega.id}`, {
      secure_mode: true,
      quantity: quantity,
      cliente_id: this.cliente ? this.cliente.id : undefined,
      entidad_id: this.entidad ? this.entidad.id : undefined,
      razon: razon
    });
    promise
      .then((resp) => {
        this.dismiss(resp);
      })
      .catch((err) => {
        this.api.error(err);
      });
    return promise;
  }

  move(quantity, razon = "") {
    var promise = this.api.post(`inventarios/${this.item.id}/move/${this.bodega.id}/${this.transaction.bodega_saliente_id}`, {
      secure_mode: true,
      quantity: quantity,
      cliente_id: this.cliente ? this.cliente.id : undefined,
      entidad_id: this.entidad ? this.entidad.id : undefined,
      razon: razon
    });
    promise
      .then((resp) => {
        this.dismiss(resp);
      })
      .catch((err) => {
        this.api.error(err);
      });
    return promise;
  }

  canTrans() {
    var can = this.transaction && this.transaction.item_id && this.transaction.bodega_entrante_id && this.transaction.quantity > 0;
    if (this.transaction.transaccion == "Movimiento" && !this.transaction.bodega_saliente_id) {
      can = false;
    }
    return can;
  }

  doTrans() {
    var promise;
    if (this.transaction.transaccion == "Entrada") {
      promise = this.addEntrada(this.transaction.quantity, this.transaction.razon);
    }
    if (this.transaction.transaccion == "Salida") {
      promise = this.addSalida(this.transaction.quantity, this.transaction.razon);
    }
    if (this.transaction.transaccion == "Movimiento") {
      promise = this.move(this.transaction.quantity, this.transaction.razon);
    }
    promise.then(() => {
      this.toast
        .create({
          message: "Done!",
          duration: 1250,
          position: "top"
        })
        .present();
    });
  }

  dismiss(response: any = false) {
    this.viewctrl.dismiss(response);
  }
}
