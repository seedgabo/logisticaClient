import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, AlertController } from "ionic-angular";
import { Api } from "../../providers/api/api";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { Invoice } from "../invoice/invoice";
@IonicPage()
@Component({
  selector: "page-invoices",
  templateUrl: "invoices.html"
})
export class InvoicesPage {
  query = "";
  loading = false;
  _invoices;
  invoices = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: Api,
    public alert: AlertController,
    public inappbrowser: InAppBrowser
  ) {}

  ionViewDidLoad() {
    this.api.ready.then(() => {
      this.getInvoices();
    });
  }

  getInvoices() {
    this.loading = true;
    var uri = `invoices?paginate=500&order[number]=desc&with[]=user&with[]=cliente&append[]=products`;
    this.api
      .get(uri)
      .then((resp: any) => {
        this._invoices = resp;
        this.filter();
        this.loading = false;
      })
      .catch((err) => {
        this.api.error(err);
      });
  }

  filter() {
    if (this.query == "") {
      return (this.invoices = this._invoices.data);
    }
    var q = this.query.toLowerCase();
    this.invoices = this._invoices.data.filter((ped) => {
      return (
        (ped.number && `${ped.number}`.toLowerCase().indexOf(q) > -1) ||
        (ped.estado && ped.estado.toLowerCase().indexOf(q) > -1) ||
        (ped.tipo && ped.tipo.toLowerCase().indexOf(q) > -1) ||
        (ped.user && ped.user.nombre && ped.user.nombre.toLowerCase().indexOf(q) > -1) ||
        (ped.cliente && ped.cliente.nombres && ped.cliente.nombres.toLowerCase().indexOf(q) > -1) ||
        (ped.entidad && ped.entidad.name && ped.entidad.name.toLowerCase().indexOf(q) > -1)
      );
    });
  }

  selectInvoice(invoice) {
    this.navCtrl.push(Invoice, { invoice: invoice, edition: true });
  }

  addInvoice() {
    this.navCtrl.push(Invoice, { invoice: null, edition: true });
  }

  downloadInvoice(invoice) {
    let url = encodeURI(this.api.url + `/api/invoice/pdf/${invoice.id}?token=${this.api.user.token}`);
    this.inappbrowser.create(url, "_system");
  }

  confirmDelete(invoice, index) {
    this.alert
      .create({
        title: "Esta seguro de que quiere borrar este elemento?",
        buttons: [
          {
            text: "Borrar",
            handler: () => {
              this.deleteInvoice(invoice, index);
            }
          },
          "Cancelar"
        ]
      })
      .present();
  }

  deleteInvoice(invoice, index) {
    this.loading = true;
    this.api
      .delete("invoices/" + invoice.id)
      .then((resp) => {
        this.invoices.splice(index, 1);
        this.loading = false;
      })
      .catch((err) => {
        this.api.error(err);
        this.loading = false;
      });
  }
}
