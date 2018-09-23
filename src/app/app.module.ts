import { NgModule } from "@angular/core";
import { IonicApp, IonicModule } from "ionic-angular";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";

import { MyApp } from "./app.component";
import { AboutPage } from "../pages/about/about";
import { ContactPage } from "../pages/contact/contact";
import { HomePage } from "../pages/home/home";
import { TabsPage } from "../pages/tabs/tabs";
import { Api } from "../providers/api/api";
import { AgregarComentarioPage } from "../pages/agregar-comentario/agregar-comentario";
import { AgregarNotificacionPage } from "../pages/agregar-notificacion/agregar-notificacion";
import { AgregarTicketPage } from "../pages/agregar-ticket/agregar-ticket";
import { BuscadorPage } from "../pages/buscador/buscador";
import { CasoPage } from "../pages/caso/caso";
import { CasosPage } from "../pages/casos/casos";
import { CategoriaPage } from "../pages/categoria/categoria";
import { DocumentosPage } from "../pages/documentos/documentos";
import { EditTicketPage } from "../pages/edit-ticket/edit-ticket";
import { IncapacidadPage } from "../pages/incapacidad/incapacidad";
import { IncapacidadesPage } from "../pages/incapacidades/incapacidades";
import { LoginPage } from "../pages/login/login";
import { MisTicketsPage } from "../pages/mis-tickets/mis-tickets";
import { NotificacionesPage } from "../pages/notificaciones/notificaciones";
import { PacientePage } from "../pages/paciente/paciente";
import { PopoverPage } from "../pages/popover/popover";
import { TicketPage } from "../pages/ticket/ticket";
import { TicketsTodosPage } from "../pages/tickets-todos/tickets-todos";
import { ClientesHome } from "../pages/clientes-home/clientes-home";
import { listTicket } from "../pages/list-ticket/list-ticket";
import { Facturas } from "../pages/facturas/facturas";
import { Invoice } from "../pages/invoice/invoice";
import { Calendar } from "../pages/calendar/calendar";
import { Clientes } from "../pages/clientes/clientes";
import { Cliente } from "../pages/cliente/cliente";
import { Proceso } from "../pages/proceso/proceso";
import { Consulta } from "../pages/consulta/consulta";
import { ProcesoMasivoPage } from "../pages/proceso-masivo/proceso-masivo";
import { IonicStorageModule } from "@ionic/storage";
import { MomentModule } from "angular2-moment";
import { FilterTicket } from "../pipes/filter-ticket";
import { Fechar } from "../pipes/fechar";
import { ProductSearchPage } from "../pages/product-search/product-search";

import { CodePush } from "@ionic-native/code-push";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { Geolocation } from "@ionic-native/geolocation";

import { Push } from "@ionic-native/push";
import { FileTransfer } from "@ionic-native/file-transfer";
import { PipesModule } from "../pipes/pipes.module";
import { ItemFinderPage } from "../pages/item-finder/item-finder";
@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    AgregarComentarioPage,
    AgregarNotificacionPage,
    AgregarTicketPage,
    BuscadorPage,
    CasoPage,
    CasosPage,
    CategoriaPage,
    DocumentosPage,
    EditTicketPage,
    IncapacidadPage,
    IncapacidadesPage,
    LoginPage,
    MisTicketsPage,
    NotificacionesPage,
    PacientePage,
    PopoverPage,
    TicketPage,
    TicketsTodosPage,
    ClientesHome,
    Facturas,
    Invoice,
    Calendar,
    Clientes,
    Cliente,
    Proceso,
    ProcesoMasivoPage,
    Consulta,
    listTicket,
    ProductSearchPage,
    ItemFinderPage,
    FilterTicket,
    Fechar
  ],
  imports: [BrowserModule, HttpModule, MomentModule, IonicModule.forRoot(MyApp), IonicStorageModule.forRoot(), PipesModule],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    AgregarComentarioPage,
    AgregarNotificacionPage,
    AgregarTicketPage,
    BuscadorPage,
    CasoPage,
    CasosPage,
    CategoriaPage,
    DocumentosPage,
    EditTicketPage,
    IncapacidadPage,
    IncapacidadesPage,
    LoginPage,
    MisTicketsPage,
    NotificacionesPage,
    PacientePage,
    PopoverPage,
    TicketPage,
    TicketsTodosPage,
    ClientesHome,
    Calendar,
    Clientes,
    Cliente,
    Proceso,
    ProcesoMasivoPage,
    Consulta,
    Facturas,
    Invoice,
    listTicket,
    ProductSearchPage,
    ItemFinderPage
  ],
  providers: [Api, CodePush, SplashScreen, Geolocation, StatusBar, InAppBrowser, Push, FileTransfer]
})
export class AppModule {}
