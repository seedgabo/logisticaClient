import { Component } from "@angular/core";
import { NavController, ModalController } from "ionic-angular";
import { Api } from "../../providers/api/api";
import { LoginPage } from "../login/login";
import { TicketPage } from "../ticket/ticket";
import { NotificacionesPage } from "../notificaciones/notificaciones";
import { Facturas } from "../facturas/facturas";
declare var moment: any;
@Component({
  selector: "page-clientes-home",
  templateUrl: "clientes-home.html"
})
export class ClientesHome {
  orders = [];
  _orders = [];
  query: string = "";
  constructor(public navCtrl: NavController, public api: Api, public modal: ModalController) {}

  ionViewDidEnter() {
    this.getOrders();
  }

  getOrders(refresher = null) {
    this.api
      .get(`pedidos?where[cliente_id]=${this.api.user.cliente_id}&paginate=150&order[updated_at]=&order[estado]=desc`)
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
    this.navCtrl.push("OrderPage", { pedido: order });
  }

  createOrder() {
    let modal = this.modal.create("OrderCreatorPage");
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
