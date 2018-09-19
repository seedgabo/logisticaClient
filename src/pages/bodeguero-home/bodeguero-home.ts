import { Component } from "@angular/core";
import { IonicPage, NavController, ModalController } from "ionic-angular";
import { Api } from "../../providers/api/api";
import { NotificacionesPage } from "../notificaciones/notificaciones";
@IonicPage()
@Component({
  selector: "page-bodeguero-home",
  templateUrl: "bodeguero-home.html"
})
export class BodegueroHomePage {
  orders = [];
  _orders = [];
  query: string = "";
  constructor(public navCtrl: NavController, public api: Api, public modal: ModalController) {}

  ionViewDidEnter() {
    this.getOrders();
  }

  getOrders(refresher = null) {
    this.api.ready.then(() => {
      this.api
        .get(
          `pedidos?where[estado]=solicitud recogida&paginate=150&order[updated_at]=&order[estado]=desc&include=items.unit,archivos,driver`
        )
        .then((data: any) => {
          this._orders = data.data;
          this.filter();
          if (refresher) {
            refresher.complete();
          }
        })
        .catch((err) => {
          if (refresher) {
            refresher.complete();
          }
        });
    });
  }

  filter() {
    if (this.query == "") {
      return (this.orders = this._orders);
    }
    var q = this.query.toLowerCase();
    this.orders = this._orders.filter((o) => {
      return (
        o.numero_pedido.toLowerCase().indexOf(q) > -1 || o.estado.toLowerCase().indexOf(q) > -1 || o.tipo.toLowerCase().indexOf(q) > -1
      );
    });
  }

  gotoOrder(order) {
    this.navCtrl.push("OrderEditorBodegaPage", { order: order });
  }

  createOrder() {
    var order: any = {
      fecha_pedido: new Date().toISOString(),
      tipo: "Residuos Aprovechables",
      estado: "solicitud en bodega",
      fecha_entrega: new Date().toISOString(),
      direccion_envio: null,
      user_id: this.api.user.id,
      entidad_id: this.api.user.entidad_id,
      items: []
    };
    let modal = this.modal.create("OrderEditorBodegaPage", { order: order });
    modal.present();
    modal.onDidDismiss((data) => {
      if (data) {
        this.getOrders();
      }
    });
  }

  toNotificaciones() {
    this.navCtrl.push(NotificacionesPage);
  }
}
