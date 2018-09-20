import { Component } from "@angular/core";
import { IonicPage, NavController, ModalController, ActionSheetController } from "ionic-angular";
import { Api } from "../../providers/api/api";
import moment from "moment";
import { NotificacionesPage } from "../notificaciones/notificaciones";
@IonicPage()
@Component({
  selector: "page-conductor-home",
  templateUrl: "conductor-home.html"
})
export class ConductorHomePage {
  orders = [];
  _orders = [];
  query: string = "";
  ready = false;
  orderable = {
    past: [],
    yesterday: [],
    today: [],
    tomorrow: [],
    week: [],
    next: []
  };
  trans = {
    past: "Pasadas",
    yesterday: "Ayer",
    today: "Hoy",
    tomorrow: "Mañana",
    week: "Esta Semana",
    next: "Programadas"
  };
  constructor(public navCtrl: NavController, public api: Api, public modal: ModalController, public actionsheet: ActionSheetController) {}

  ionViewDidEnter() {
    this.api.ready.then(() => {
      this.getOrders();
    });
  }
  getOrders(refresher = null) {
    this.api
      .get(
        `pedidos?include=cliente,items.unit,archivos&where[conductor_id]=${
          this.api.user.conductor.id
        }&whereIn[estado]=solicitud programada&paginate=300&order[updated_at]=&order[estado]=desc`
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
  }

  sort() {
    this.orderable = {
      past: [],
      yesterday: [],
      today: [],
      tomorrow: [],
      week: [],
      next: []
    };
    this.orders.forEach((o) => {
      var d = moment(o.fecha_envio);
      var now = moment();
      if (now.isSame(d, "day")) {
        this.orderable.today.push(o);
      } else if (
        now
          .clone()
          .add(1, "d")
          .isSame(d, "day")
      ) {
        this.orderable.tomorrow.push(o);
      } else if (
        now
          .clone()
          .subtract(1, "d")
          .isSame(d, "day")
      ) {
        this.orderable.yesterday.push(o);
      } else if (now > d) {
        this.orderable.past.push(o);
      } else if (now.clone().isSame(d, "week")) {
        this.orderable.week.push(o);
      } else if (now < d) {
        this.orderable.next.push(o);
      }
    });
  }

  options(order) {
    var buttons = [
      {
        icon: "map",
        text: "Ver",
        handler: () => {
          this.navCtrl.push("OrderPage", { order: order });
        }
      },
      {
        icon: "create",
        text: "Editar",
        handler: () => {
          let modal = this.modal.create("OrderEditorPage", { order: order });
          modal.present();
          modal.onWillDismiss(() => {
            this.getOrders();
          });
        }
      },
      {
        icon: "checkmark",
        text: "Marcar Como Recogido",
        handler: () => {
          this.api.put(`pedidos/${order.id}`, { estado: "solicitud recogida" }).then(() => {
            this.getOrders();
          });
        }
      },
      // {
      //   icon: "clock",
      //   text: "Marcar Como Retrasado",
      //   handler: () => {},
      //   role: "destructive"
      // },
      {
        icon: "close",
        text: this.api.trans("crud.cancel"),
        handler: () => {},
        role: "cancel"
      }
    ];
    if (order.estado == "solicitud recogida") {
      buttons.splice(1, 2);
      this.navCtrl.push("OrderPage", { order: order });
      return;
    }
    this.actionsheet
      .create({
        title: `${this.api.trans("literals.order")} ${order.numero_pedido}`,
        buttons: buttons
      })
      .present();
  }

  filter() {
    if (this.query == "") {
      this.orders = this._orders;
      this.sort();
      return;
    }
    var q = this.query.toLowerCase();
    this.orders = this._orders.filter((o) => {
      return (
        o.numero_pedido.toLowerCase().indexOf(q) > -1 || o.estado.toLowerCase().indexOf(q) > -1 || o.tipo.toLowerCase().indexOf(q) > -1
      );
    });
    this.sort();
  }

  gotoOrder(order) {
    let modal = this.modal.create("OrderCreatorPage", { order: order });
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
