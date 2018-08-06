import { Component } from "@angular/core";
import { NavController, ToastController } from "ionic-angular";
import { HomePage } from "../home/home";
import { AboutPage } from "../about/about";
import { ContactPage } from "../contact/contact";
import { LoginPage } from "../login/login";
import { MisTicketsPage } from "../mis-tickets/mis-tickets";
import { TicketsTodosPage } from "../tickets-todos/tickets-todos";
import { BuscadorPage } from "../buscador/buscador";
import { NotificacionesPage } from "../notificaciones/notificaciones";
import { Api } from "../../providers/api/api";
import { Calendar } from "../calendar/calendar";
import { Clientes } from "../clientes/clientes";

@Component({
  templateUrl: "tabs.html"
})
export class TabsPage {
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
  constructor(public navCtrl: NavController, public api: Api, public toast: ToastController) {}

  ionViewDidLoad() {
    this.api.ready.then(() => {
      this.can();
    });
  }
  toLogin() {
    let root: NavController = this.navCtrl;
    this.api.user = {};
    this.api.storage.remove("user");
    root.setRoot(LoginPage);
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

  Annotations() {
    this.navCtrl.push("AnnotationsPage");
  }

  Invoices() {
    this.navCtrl.push("InvoicesPage");
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
