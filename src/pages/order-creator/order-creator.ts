import { Component } from "@angular/core";
import { IonicPage, NavParams, ModalController, ViewController } from "ionic-angular";
import { Api } from "../../providers/api/api";
import moment from "moment";
import { ProductSearchPage } from "../product-search/product-search";
@IonicPage()
@Component({
  selector: "page-order-creator",
  templateUrl: "order-creator.html"
})
export class OrderCreatorPage {
  order: any = {
    fecha_pedido: moment()
      .local()
      .toDate()
      .toISOString(),
    numero_pedido: null,
    estado: "pedido",
    fecha_entrega: null,
    user_id: this.api.user.id,
    entidad_id: null,
    cliente_id: null,
    items: []
  };
  editing = true;
  constructor(public viewCtrl: ViewController, public navParams: NavParams, public api: Api, public modal: ModalController) {
    if (this.navParams.get("order")) {
      this.order = Object.assign({}, this.navParams.get("order"));
      console.log(this.order);
      if (this.order.fecha_pedido) {
        this.order.fecha_pedido = moment
          .utc(this.order.fecha_pedido)
          .local()
          .toDate()
          .toISOString();
      }
    }
    if (this.navParams.get("editing")) {
      this.editing = this.navParams.get("editing");
    }
  }

  ionViewDidLoad() {
    this.api.ready.then((user) => {
      if (user) {
        this.api.load("clientes");
        this.api.load("entidades");
        this.api.load("users");
      }
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  save() {
    var promise;
    var data = {
      numero_pedido: this.order.numero_pedido ? this.order.numero_pedido : undefined,
      fecha_pedido: moment(this.order.fecha_pedido)
        .local()
        .format("YYYY-MM-DD HH:mm:ss"),
      estado: this.order.estado,
      user_id: this.order.user_id ? this.order.user_id : this.api.user.id,
      entidad_id: this.order.entidad_id,
      cliente_id: this.order.cliente_id,
      items: this.order.items
    };
    if (this.order.id) {
      promise = this.api.put(`pedidos/${this.order.id}`, data);
    } else {
      promise = this.api.post(`pedidos`, data);
    }
    promise
      .then((resp) => {
        this.order = resp;
        this.editing = false;
        this.viewCtrl.dismiss(this.order);
      })
      .catch((err) => {
        this.api.error(err);
      });
  }

  addItem() {
    var modal = this.modal.create(ProductSearchPage, {});
    modal.present();
    modal.onDidDismiss((data, role) => {
      if (role !== "cancel") {
        console.log(data, role);
        this._addItem(data);
      }
    });
  }

  _addItem(item) {
    this.order.items.push(item);
  }

  removeItem(i) {
    this.order.items.splice(i, 1);
  }

  total() {
    var total = 0;
    this.order.items.forEach((element) => {
      total += element.cantidad_pedidos + element.precio;
    });
    return total;
  }

  canSave() {
    return this.order.items && this.order.items.length > 0 && this.order.cliente_id;
  }
}
