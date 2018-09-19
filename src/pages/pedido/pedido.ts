import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ModalController } from "ionic-angular";
import { Api } from "../../providers/api/api";
import moment from "moment";
import { ProductSearchPage } from "../product-search/product-search";
@IonicPage()
@Component({
  selector: "page-pedido",
  templateUrl: "pedido.html"
})
export class PedidoPage {
  pedido: any = {
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
  advanced = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public modal: ModalController) {
    if (this.navParams.get("pedido")) {
      this.pedido = Object.assign({}, this.navParams.get("pedido"));
      console.log(this.pedido);
      if (this.pedido.fecha_pedido) {
        this.pedido.fecha_pedido = moment
          .utc(this.pedido.fecha_pedido)
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

  save() {
    var promise;
    var data = {
      numero_pedido: this.pedido.numero_pedido ? this.pedido.numero_pedido : undefined,
      fecha_pedido: this.pedido.fecha_pedido
        ? moment(this.pedido.fecha_pedido)
            .local()
            .format("YYYY-MM-DD HH:mm:ss")
        : undefined,
      estado: this.pedido.estado,
      fecha_entrega: this.pedido.fecha_entrega
        ? moment(this.pedido.fecha_entrega)
            .local()
            .format("YYYY-MM-DD HH:mm:ss")
        : undefined,
      user_id: this.pedido.user_id ? this.pedido.user_id : this.api.user.id,
      entidad_id: this.pedido.entidad_id,
      cliente_id: this.pedido.cliente_id,
      items: this.pedido.items
    };
    if (this.pedido.id) {
      promise = this.api.put(`pedidos/${this.pedido.id}`, data);
    } else {
      promise = this.api.post(`pedidos`, data);
    }
    promise
      .then((resp) => {
        this.pedido = resp;
        this.editing = false;
        this.navCtrl.pop();
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
    if (this.pedido.items.find((i) => i.id == item.id) == null) {
      this.pedido.items.push(item);
    }
  }

  removeItem(i) {
    this.pedido.items.splice(i, 1);
  }

  total() {
    var total = 0;
    this.pedido.items.forEach((element) => {
      total += element.cantidad_pedidos + element.precio;
    });
    return total;
  }

  canSave() {
    return this.pedido.items && this.pedido.items.length > 0 && this.pedido.cliente_id;
  }
}
