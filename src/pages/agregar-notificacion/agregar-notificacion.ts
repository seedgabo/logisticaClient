import { Component } from "@angular/core";
import { ViewController, LoadingController, AlertController, Platform } from "ionic-angular";
import { Api } from "../../providers/api/api";
@Component({
  templateUrl: "agregar-notificacion.html"
})
export class AgregarNotificacionPage {
  api: Api;
  usuarios: any = [];
  notification: any = {};
  constructor(
    public viewctrl: ViewController,
    api: Api,
    public loading: LoadingController,
    public alert: AlertController,
    public platform: Platform
  ) {
    this.api = api;
    this.getUsuarios();
    this.notification = {
      titulo: "",
      contenido: "",
      users_id: [],
      programado: new Date(new Date().getTime() + 60 * 60 * 24 * 1000).toISOString(),
      inmediato: false
    };
  }

  getUsuarios() {
    if (this.api.user.admin == 0) {
      this.usuarios[0] = this.api.user;
      this.notification.users_id[0] = this.api.user.id;
    } else {
      this.api.getUsuarios().then((data: any) => {
        this.usuarios = data.usuarios;
        this.notification.users_id[0] = this.api.user.id;
      });
    }
  }

  seleccionarTodos() {
    let seleccionados = [];
    for (var i = 0; i < this.usuarios.length; i++) {
      seleccionados[i] = this.usuarios[i].id;
    }
    this.notification.users_id = seleccionados;
  }

  dismiss() {
    this.viewctrl.dismiss({ agregado: false });
  }

  agregarAlerta() {
    let loading = this.loading.create({ content: "Cargando" });
    loading.present();
    this.api.postAlerta(this.notification).then((data) => {
      loading.dismiss().then(() => {
        this.viewctrl.dismiss({ agregado: true });
      });
    });
  }

  rellenado() {
    return !(
      this.notification.titulo.length > 3 &&
      this.notification.contenido.length > 3 &&
      this.notification.users_id.length >= 1 &&
      this.notification.programado != ""
    );
  }
}
