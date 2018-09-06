import { Component } from "@angular/core";
import { IonicPage, NavParams, ModalController, ViewController } from "ionic-angular";
import { Api } from "../../providers/api/api";
import moment from "moment";
@IonicPage()
@Component({
  selector: "page-order-editor",
  templateUrl: "order-editor.html"
})
export class OrderEditorPage {
  order: any = {
    fecha_pedido: moment()
      .local()
      .toDate()
      .toISOString(),
    tipo: "Residuos Aprovechables",
    estado: "solicitud generada",
    fecha_entrega: null,
    direccion_envio: null,
    user_id: this.api.user.id,
    cliente_id: this.api.user.cliente_id,
    entidad_id: this.api.user.entidad_id,
    items: []
  };
  signature = false;
  loading = false;
  tipos = ["Residuos Aprovechables", "Residuos Peligrosos", "Destrucción", "Orgánicos"];
  constructor(public viewCtrl: ViewController, public navParams: NavParams, public modal: ModalController, public api: Api) {
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
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  async save() {
    this.loading = true;
    var count: any = await this.api.get(`pedidos?where[cliente_id]=${this.api.user.cliente_id}&count=1`).catch((err) => {
      this.loading = false;
    });
    function pad(n, width, z = "0") {
      n = n + "";
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
    count = pad(++count, 3);
    var promise;
    var data = {
      numero_pedido: `01/${this.api.user.cliente.document}/0${this.tipos.indexOf(this.order.tipo) + 1}/${count}`,
      direccion_envio: this.order.direccion_envio,
      tipo: this.order.tipo,
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
        this.loading = false;
      })
      .catch((err) => {
        this.loading = false;
        this.api.error(err);
      });
  }

  addItem() {
    var modal = this.modal.create(ProductSearchPage, {});
    modal.present();
    modal.onDidDismiss((data, role) => {
      if (role !== "cancel") {
        console.log(data, role);
        data.cantidad_pedidos = 1;
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
    return this.order.direccion_envio && this.order.tipo && this.order.items && this.order.items.length > 0 && this.order.cliente_id;
  }
}
