import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Api } from "../../providers/api/api";
@IonicPage()
@Component({
  selector: "page-suppliers",
  templateUrl: "suppliers.html"
})
export class SuppliersPage {
  suppliers: any = [];
  query = "";
  loading = true;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {}

  ionViewDidLoad(refresher = null) {
    this.api.ready.then(() => {
      this.get()
        .then(() => {
          if (refresher) refresher.complete();
        })
        .catch((err) => {
          if (refresher) refresher.complete();
        });
    });
  }

  get(search = []) {
    var uri = "proveedores?paginate=100";
    for (let i = 0; i < search.length; i++) {
      uri += `&orWhereLike[${search[i].index}]=${search[i].value}`;
    }
    var promise = this.api.get(uri);
    promise
      .then((resp: any) => {
        this.suppliers = resp.data;
      })
      .catch((err) => {
        this.api.error(err);
      });
    return promise;
  }

  buscar() {
    let searcher = [
      { index: "nombres", value: this.query },
      { index: "apellidos", value: this.query },
      { index: "nit", value: this.query },
      { index: "cedula", value: this.query }
    ];
    this.get(searcher);
  }

  verSupplier(supplier) {
    this.navCtrl.push("SupplierPage", { supplier: supplier });
  }
}
