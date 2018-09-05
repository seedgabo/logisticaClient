import { Component } from "@angular/core";
import { NavController, NavParams, ViewController } from "ionic-angular";
import { Api } from "../../providers/api/api";
@Component({
  selector: "page-product-search",
  templateUrl: "product-search.html"
})
export class ProductSearchPage {
  query = "";
  productos = [];
  categorias = [];
  loading = false;
  ready = false;
  local = true;
  categoria = null;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewctrl: ViewController, public api: Api) {
    this.api.load("categorias-productos?with[]=productos").then((resp: any) => {
      this.ready = true;
      this.categorias = resp;
    });
  }

  ionViewDidLoad() {}

  search() {
    return this.searchLocal();
  }

  searchLocal() {
    var limit = 100;
    var results = [];
    var filter = this.query.toLowerCase();
    for (var i = 0; i < this.categoria.productos.length; i++) {
      var item = this.categoria.productos[i];
      if (item.name && item.name.toLowerCase().indexOf(filter) > -1) {
        results.push(item);
      }
      if (results.length == limit) {
        break;
      }
    }
    this.productos = results;
  }

  selectCat(cat) {
    this.categoria = cat;
    this.searchLocal();
  }

  cancel() {
    this.viewctrl.dismiss(null, "cancel");
  }

  select(product) {
    this.viewctrl.dismiss(product, "accept");
  }
}
