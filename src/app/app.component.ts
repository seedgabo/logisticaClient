import { Component, ViewChild } from "@angular/core";
import { Platform, Nav, Events } from "ionic-angular";
import { TabsPage } from "../pages/tabs/tabs";
import { Api } from "../providers/api/api";
import { LoginPage } from "../pages/login/login";
import { ClientesHome } from "../pages/clientes-home/clientes-home";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { CodePush, InstallMode } from "@ionic-native/code-push";
import { HomePage } from "../pages/home/home";
import { TicketsTodosPage } from "../pages/tickets-todos/tickets-todos";
import { MisTicketsPage } from "../pages/mis-tickets/mis-tickets";
import { AboutPage } from "../pages/about/about";
import { ContactPage } from "../pages/contact/contact";
import { Clientes } from "../pages/clientes/clientes";
import { NotificacionesPage } from "../pages/notificaciones/notificaciones";
import { BuscadorPage } from "../pages/buscador/buscador";
import { Calendar } from "../pages/calendar/calendar";
@Component({
  templateUrl: `./app.html`
})
export class MyApp {
  rootPage: any;
  @ViewChild(Nav) navCtrl: Nav;
  modulos = {
    tickets: false,
    calendario: false,
    documentos: false,
    clientes: false,
    facturas: false,
    proveedores: false,
    pedidos: false,
    historias_clinicas: false,
    inventarios: false,
    anotaciones: false
  };
  constructor(
    platform: Platform,
    public api: Api,
    public statusbar: StatusBar,
    public splashscreen: SplashScreen,
    public codepush: CodePush,
    public events: Events
  ) {
    platform.ready().then(() => {
      this.api.storage.get("user").then((data) => {
        if (data == undefined) this.rootPage = LoginPage;
        else {
          if (data.modulos.clientes && data.iscliente) {
            this.rootPage = ClientesHome;
          } else {
            this.rootPage = TabsPage;
            this.api.ready.then(() => {
              this.can();
            });
          }
        }
      });

      this.events.subscribe("login", () => {
        this.api.ready.then(() => {
          this.can();
        });
      });
      this.splashscreen.hide();
      this.statusbar.styleDefault();
      const downloadProgress = (progress) => {
        console.log(`Downloaded ${progress.receivedBytes} of ${progress.totalBytes}`);
      };
      this.codepush.sync({ updateDialog: false, installMode: InstallMode.IMMEDIATE }, downloadProgress).subscribe(
        (syncStatus) => console.log(syncStatus),
        (err) => {
          console.warn(err);
        }
      );
    });
  }
  toLogin() {
    this.api.user = {};
    this.api.storage.remove("user");
    this.navCtrl.setRoot(LoginPage);
  }
  openBuscador() {
    this.navCtrl.push(BuscadorPage);
  }
  toNotificaciones() {
    this.navCtrl.push(NotificacionesPage);
  }

  MisTickets() {
    this.navCtrl.push(MisTicketsPage);
  }

  TicketTodos() {
    this.navCtrl.push(TicketsTodosPage);
  }

  Tickets() {
    this.navCtrl.push(HomePage);
  }
  Documentos() {
    this.navCtrl.push(AboutPage);
  }

  Clinica() {
    this.navCtrl.push(ContactPage);
  }

  gotoClientes() {
    this.navCtrl.push(Clientes);
  }

  Suppliers() {
    this.navCtrl.push("SuppliersPage");
  }

  Calendar() {
    this.navCtrl.push(Calendar);
  }

  Pedidos() {
    this.navCtrl.push("PedidosPage");
  }

  Invoices() {
    this.navCtrl.push("InvoicesPage");
  }
  Annotations() {
    this.navCtrl.push("AnnotationsPage");
  }
  Bodegas() {
    this.navCtrl.push("StoragePage");
  }

  can() {
    this.modulos = {
      tickets: this.api.user.modulos.tickets,
      calendario: this.api.user.modulos.calendario,
      documentos: this.api.user.modulos.gestion_documental,
      clientes: this.api.user.modulos.clientes,
      facturas: this.api.user.modulos.facturas,
      proveedores: this.api.user.modulos.proveedores,
      pedidos: this.api.user.modulos.pedidos,
      historias_clinicas: this.api.user.modulos.historias_clinicas,
      inventarios: this.api.user.modulos.inventarios,
      anotaciones: this.api.user.modulos.anotaciones
    };
    var roles = this.api.mapToCollection(this.api.user.roles, "name");
    if (!this.api.user.medico) {
      this.modulos.historias_clinicas = false;
    }
    if (roles["SuperAdmin"]) {
      return;
    }
    if (!roles["Administrar Clientes"]) {
      this.modulos.clientes = false;
    }
    if (!roles["Administrar Facturas"]) {
      this.modulos.clientes = false;
    }
    if (!roles["Administrar Pedidos"]) {
      this.modulos.clientes = false;
    }
    if (!roles["Administrar Proveedores"]) {
      this.modulos.clientes = false;
    }
    if (!roles["Administrar Pedidos"]) {
      this.modulos.clientes = false;
    }
    if (!roles["Administrar Bodegas"]) {
      this.modulos.clientes = false;
    }
    if (!roles["Administrar Minutas"]) {
      this.modulos.anotaciones = false;
    }
  }
}
