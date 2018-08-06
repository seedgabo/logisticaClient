import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Api } from "../../providers/api/api";
import { InAppBrowser } from "@ionic-native/in-app-browser";
declare var window: any;
@Component({
  selector: "page-invoice",
  templateUrl: "invoice.html"
})
export class Invoice {
  invoice: any = null;
  constructor(public navCtrl: NavController, nav: NavParams, public api: Api, public inappbrowser: InAppBrowser) {
    this.invoice = nav.get("invoice");
    this.getInvoice();
  }

  getInvoice() {
    this.api.ready.then(() => {
      this.api
        .get(
          `invoices/${
            this.invoice.id
          }?with[]=cliente&with[]=entidad&with[]=pedido&with[]=user&with[]=vendedor&with[]=debitnotes&with[]=creditnotes&with[]=receipts&append[]=products`
        )
        .then((resp) => {
          this.invoice = resp;
        })
        .catch((err) => {
          this.api.error(err);
        });
    });
  }

  downloadPdf() {
    let url = encodeURI(this.api.urlAuth(`admin/ver-invoice/pdf/${this.invoice.id}`));
    if (window.cordova) {
      this.inappbrowser.create(url, "_system");
      return;
    }
    window.open(url, "_blank");
  }
}
