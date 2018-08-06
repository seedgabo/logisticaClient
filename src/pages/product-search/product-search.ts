import { Component } from "@angular/core";
import { NavController, NavParams, ViewController } from "ionic-angular";
import { Api } from "../../providers/api/api";
@Component({
  selector: "page-product-search",
  templateUrl: "product-search.html"
})
export class ProductSearchPage {
  query = "";
  products = [];
  loading = false;
  ready = false;
  local = true;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewctrl: ViewController, public api: Api) {
    this.api.storage.get("recent_products").then((recent_products) => {
      if (recent_products) {
        this.products = recent_products;
      }
    });
    this.api.load("productos").then(() => {
      this.ready = true;
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
    for (var i = 0; i < this.api.objects.products.length; i++) {
      var item = this.api.objects.products[i];
      console.log(item);
      if (item.name && item.name.toLowerCase().indexOf(filter) > -1) {
        results.push(item);
      }
      if (results.length == limit) {
        break;
      }
    }
    this.products = results;
    this.api.storage.set("recent_products", this.products);
  }

  cancel() {
    this.viewctrl.dismiss(null, "cancel");
  }

  select(product) {
    this.viewctrl.dismiss(product, "accept");
  }
}
