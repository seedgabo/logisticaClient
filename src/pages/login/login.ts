import { Component } from "@angular/core";
import { NavController, AlertController, LoadingController, ModalController, Events } from "ionic-angular";
import { Api } from "../../providers/api/api";
import { TabsPage } from "../tabs/tabs";
import { ClientesHome } from "../clientes-home/clientes-home";
declare var window: any;
@Component({
  templateUrl: "login.html"
})
export class LoginPage {
  prefilled = false;
  constructor(
    public navController: NavController,
    public api: Api,
    public alert: AlertController,
    public loading: LoadingController,
    public modal: ModalController,
    public events: Events
  ) {
    if (window.url) {
      this.prefilled = true;
    }
  }

  doLogin() {
    if (this.api.url.indexOf("http") == -1) {
      this.api.url = `http://newton.eycproveedores.com/${this.api.url}/public/`;
    }
    if (this.api.url[this.api.url.length - 1] != "/") {
      this.api.url += "/";
    }
    let loader = this.loading.create({
      content: "Iniciando Sesión...",
      duration: 3000
    });
    loader.present();
    this.api
      .doLogin()
      .then((data: any) => {
        if (data.nombre) {
          this.api
            .get("lang")
            .then((langs) => {
              this.api.langs = langs;
            })
            .catch(console.error);
          loader.dismiss().then(() => {
            if (data.modulos.clientes && data.iscliente) {
              this.navController.setRoot(ClientesHome);
            } else {
              this.navController.setRoot(TabsPage);
              this.events.publish("login", {});
            }

            if (!this.api.user.first_login) {
              this.modal.create("PasswordChangePage").present();
            }
            try {
              this.api.pushRegister();
            } catch (error) {
              console.warn(error);
            }
          });
        } else {
          loader.dismiss().then(() => {
            this.alert.create({ title: "Error", message: "Usuario y Contraseña Invalidos", buttons: ["ok"] }).present();
          });
        }
      })
      .catch((err: any) => {
        console.error(err);
        loader.dismiss().then(() => {
          this.alert.create({ title: "Error", message: "Error al iniciar sesión", buttons: ["ok"] }).present();
        });
      });
  }
}
