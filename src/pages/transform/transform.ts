import { Component } from "@angular/core";
import { IonicPage, NavParams, ViewController, ToastController } from "ionic-angular";
import { Api } from "../../providers/api/api";
@IonicPage()
@Component({
  selector: "page-transform",
  templateUrl: "transform.html"
})
export class TransformPage {
  entries = [];
  outputs = [];
  bodega = null;
  reason = "";
  loading = false;
  constructor(public viewCtrl: ViewController, public navParams: NavParams, public api: Api, public toast: ToastController) {
    this.bodega = this.navParams.get("bodega");
  }
  ionViewDidLoad() {
    this.api.load("items");
    this.addEntry();
    this.addOutput();
  }

  addEntry() {
    this.entries.push({
      item_id: null,
      bodega_id: this.bodega.id,
      quantity: 1
    });
  }
  addOutput() {
    this.outputs.push({
      item_id: null,
      bodega_id: this.bodega.id,
      quantity: 1
    });
  }

  removeEntry(i) {
    this.entries.splice(i, 1);
  }
  removeOutput(i) {
    this.outputs.splice(i, 1);
  }

  dismiss() {
    this.viewCtrl.dismiss(null);
  }

  process() {
    var data = {
      razon: this.reason,
      entries: this.entries,
      outputs: this.outputs
    };
    this.loading = true;
    this.api
      .post("inventarios/transform", data)
      .then((resp) => {
        this.viewCtrl.dismiss(resp);
        this.loading = false;
        this.toast
          .create({
            duration: 2000,
            message: this.api.trans("crud.saved", {})
          })
          .present();
      })
      .catch((error) => {
        this.loading = false;
        this.api.error(error);
      });
  }

  canProcess() {
    var can = this.reason.length > 0 && this.entries.length > 0 && this.outputs.length > 0;
    if (can) {
      for (let index = 0; index < this.entries.length; index++) {
        const element = this.entries[index];
        if (!element.item_id || element.quantity === 0) {
          can = false;
          break;
        }
      }
      for (let index = 0; index < this.outputs.length; index++) {
        const element = this.outputs[index];
        if (!element.item_id || element.quantity === 0) {
          can = false;
          break;
        }
      }
    }

    return can;
  }
}
