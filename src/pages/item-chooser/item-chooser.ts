import { Component } from "@angular/core";
import { IonicPage, ViewController, NavParams } from "ionic-angular";
import { Api } from "../../providers/api/api";
@IonicPage()
@Component({
  selector: "page-item-chooser",
  templateUrl: "item-chooser.html"
})
export class ItemChooserPage {
  disableds = [];
  items = [];
  quantity = 1;
  item = null;
  razon = "";
  constructor(public viewCtrl: ViewController, public navParams: NavParams, public api: Api) {
    if (this.navParams.get("disableds")) this.disableds = this.navParams.get("disableds");
    this.api.load("items").then((resp) => {
      this.items = JSON.parse(JSON.stringify(resp));
      this.items.filter((item) => {
        item.disabled = this.disableds.indexOf(item.id) > -1;
        return !item.disabled;
      });
    });
  }

  ionViewDidLoad() {}

  choose() {
    this.viewCtrl.dismiss({
      razon: this.razon,
      quantity: this.quantity,
      item: this.item
    });
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  canChoose() {
    return this.item && this.quantity > 0;
  }
}
