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
  query: string = "";
  constructor(public navCtrl: NavController, public api: Api, public modal: ModalController) {}

  ionViewDidLoad() {}

  getOrders() {
    this.api
      .get(`pedidos?where[cliente_id]=${this.api.user.cliente_id}&paginate=150&order[updated_at]=&order[status]=desc`)
      .then((data: any) => {
        this.orders = data;
      });
  }

  gotoOrder(order) {
    this.navCtrl.push("PedidoPage", { pedido: order });
  }

  toLogin() {
    this.api.user = {};
    this.api.storage.remove("user");
    this.navCtrl.setRoot(LoginPage);
  }

  MisFacturas() {
    this.navCtrl.push(Facturas);
  }

  toNotificaciones() {
    this.navCtrl.push(NotificacionesPage);
  }
}
