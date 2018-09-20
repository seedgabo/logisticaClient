import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Api } from "../../providers/api/api";
@IonicPage()
@Component({
  selector: "page-storage",
  templateUrl: "storage.html"
})
export class StoragePage {
  bodegas = [];
  _bodegas = [];
  query = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {}

  ionViewDidLoad() {
    this.api.ready.then(() => {
      this.getBodegas();
    });
  }

  getBodegas(refresher = null) {
    this.api
      .get("bodegas?scope[byuser]=1&with[]=items.inventarios")
      .then((resp: any) => {
        this._bodegas = resp;
        this.filter();
        if (refresher) refresher.complete();
      })
      .catch((err) => {
        console.error(err);
        this.api.error(err);
        if (refresher) refresher.complete();
      });
  }

  filter() {
    if (this.query == "") {
      return (this.bodegas = this._bodegas);
    }
    var q = this.query.toLowerCase();
    this.bodegas = this._bodegas.filter((i) => {
      return i.nombre.toLowerCase().indexOf(q) > -1;
    });
  }

  gotoBodega(bodega) {
    this.navCtrl.push("BodegaPage", { storage: bodega });
  }
}
