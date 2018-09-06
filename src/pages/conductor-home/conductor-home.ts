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
    tomorrow: "Manana",
    week: "Esta Semana",
    next: "Programadas"
  };
  constructor(public navCtrl: NavController, public api: Api, public modal: ModalController, public actionsheet: ActionSheetController) {}

  ionViewDidEnter() {
    this.api.ready.then(() => {
      this.getOrders();
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
      var d = moment(o.fecha_entrega);
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

  getOrders(refresher = null) {
    this.api
      .get(
        `pedidos?with[]=cliente&where[conductor_id]=${
          this.api.user.conductor.id
        }&whereNotNull[]=fecha_entrega&paginate=300&order[updated_at]=&order[estado]=desc`
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

  options(order) {
    this.actionsheet
      .create({
        title: `${this.api.trans("literals.order")} ${order.numero_pedido}`,
        buttons: [
          {
            icon: "map",
            text: "Ver",
            handler: () => {
              this.navCtrl.push("OrderPage", { pedido: order });
            }
          },
          {
            icon: "create",
            text: "Editar",
            handler: () => {}
          },
          {
            icon: "car",
            text: "Marcar Como En Camino",
            handler: () => {}
          },
          {
            icon: "checkmark",
            text: "Marcar Como Entregado",
            handler: () => {}
          },
          {
            icon: "clock",
            text: "Marcar Como Retrasado",
            handler: () => {},
            role: "destructive"
          },
          {
            icon: "close",
            text: this.api.trans("crud.cancel"),
            handler: () => {},
            role: "cancel"
          }
        ]
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
    let modal = this.modal.create("OrderCreatorPage", { pedido: order });
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
