import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Api } from "../../providers/api/api";
@IonicPage()
@Component({
  selector: "page-supplier",
  templateUrl: "supplier.html"
})
export class SupplierPage {
  supplier: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
    this.supplier = this.navParams.get("supplier");
  }

  ionViewDidLoad() {}
}
