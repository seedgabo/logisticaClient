import { Component } from "@angular/core";
import { NavController, ModalController } from "ionic-angular";
import { Api } from "../../providers/api/api";

import { AgregarNotificacionPage } from "../agregar-notificacion/agregar-notificacion";
import { TicketPage } from "../ticket/ticket";

@Component({
  templateUrl: "notificaciones.html"
})
export class NotificacionesPage {
  notificaciones: any;
  constructor(public navCtrl: NavController, public api: Api, public modal: ModalController) {
    this.getNotificaciones();
  }

  getNotificaciones() {
    this.api.getNotificaciones().then((data: any) => {
      this.notificaciones = data;
    });
  }

  doRefresh(refresher) {
    this.api.getNotificaciones().then((data: any) => {
      this.notificaciones = data;
      refresher.complete();
    });
  }

  desleer(notificacion, slider) {
    this.api.desleerNotificacion(notificacion.id).then((data: any) => {});
    notificacion.leido = 0;
    slider.close();
  }

  leer(notificacion, slider) {
    this.api.leerNotificacion(notificacion.id).then((data: any) => {});
    notificacion.leido = 1;
    slider.close();
  }

  leerTodas() {
    this.api
      .get("notificaciones/leer-todas")
      .then((resp) => {
        this.notificaciones.forEach((element) => {
          element.leido = 1;
        });
      })
      .catch((err) => {
        this.api.error(err);
      });
  }

  verNotificacion(notificacion) {
    if (notificacion.ticket_id != null) {
      this.navCtrl.push(TicketPage, { ticket: { id: notificacion.ticket_id } });
    }
    this.api.leerNotificacion(notificacion.id).then((data: any) => {
      this.getNotificaciones();
    });
  }

  agregaNotificacion() {
    let modal = this.modal.create(AgregarNotificacionPage);
    modal.present();
    modal.onDidDismiss(() => {
      this.getNotificaciones();
    });
  }
}
