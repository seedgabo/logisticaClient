import { Component } from "@angular/core";
import { Calendar } from "../calendar/calendar";
import { NavController, ModalController, ToastController, Platform } from "ionic-angular";
import { Api } from "../../providers/api/api";
import { CategoriaPage } from "../categoria/categoria";
import { TicketPage } from "../ticket/ticket";
import { BuscadorPage } from "../buscador/buscador";
import { AgregarTicketPage } from "../agregar-ticket/agregar-ticket";
import { NotificacionesPage } from "../notificaciones/notificaciones";
import { AgregarNotificacionPage } from "../agregar-notificacion/agregar-notificacion";
declare var $: any;
@Component({
  templateUrl: "home.html"
})
export class HomePage {
  categorias: any;
  buscar: boolean;
  first = true;
  interval;
  constructor(
    platform: Platform,
    public navCtrl: NavController,
    public api: Api,
    public modal: ModalController,
    public toast: ToastController
  ) {}

  ionViewDidEnter() {
    this.api.ready.then(() => {
      this.load();
    });
  }

  load(refresher = null) {
    this.getCategorias();
    $("#calendar").fullCalendar({
      locale: "es",
      defaultView: "listMonth",
      buttonIcons: true,
      editable: false,
      eventLimit: true,
      events: this.api.user.events,
      customButtons: {
        verCalendar: {
          text: "Ver Calendario",
          click: () => {
            this.navCtrl.push(Calendar);
          }
        }
      },
      header: {
        left: "prev,next today",
        center: "verCalendar"
      },
      eventClick: (event) => {
        if (event.type == "ticket") {
          this.navCtrl.push(TicketPage, { ticket: event });
        } else {
          return;
        }
      },
      eventRender: (event) => {
        event.url = null;
      }
    });
  }

  getCategorias() {
    this.api.getCategorias().then((data: any) => {
      this.categorias = data;
    });
  }

  navigate(cat) {
    this.navCtrl.push(CategoriaPage, { categoria: cat });
  }

  agregarTicket() {
    let modal = this.modal.create(AgregarTicketPage);
    modal.present();
    modal.onWillDismiss((data) => {
      console.log(data);
    });
  }

  toNotificaciones() {
    this.navCtrl.push(NotificacionesPage);
  }

  openBuscador() {
    this.navCtrl.push(BuscadorPage);
  }
  agregaNotificacion() {
    let modal = this.modal.create(AgregarNotificacionPage);
    modal.present();
  }
}
