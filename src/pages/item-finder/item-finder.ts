import { Api } from "./../../providers/api/api";
import { Component } from "@angular/core";
import { NavParams, ViewController } from "ionic-angular";
@Component({
  selector: "page-item-finder",
  templateUrl: "item-finder.html"
})
export class ItemFinderPage {
  resource: string = "users";
  list = [];
  query = "";
  loading = false;
  ready = false;
  title = "full_name";
  description = "description";
  image = "image_url";
  multiple = false;
  selected = null;
  objects = [];
  constructor(public navParams: NavParams, public viewctrl: ViewController, public api: Api) {
    this.resource = navParams.data.resource;
    this.title = navParams.data.title;
    this.description = navParams.data.description;
    this.image = navParams.data.image;
    this.selected = navParams.data.selected;
    this.multiple = navParams.data.multiple;
  }

  ionViewDidLoad() {
    this.api.load(this.resource).then(() => {
      this.objects = JSON.parse(JSON.stringify(this.api.objects[this.resource]));
      if (this.selected && this.multiple) {
        this.objects.forEach((i) => {
          if (i.id && this.selected.includes(i.id)) {
            i._selected = true;
          }
        });
      }
      this.search();
      this.ready = true;
    });
  }

  search() {
    this.loading = true;
    var limit = 100;
    var filter = this.query.toLowerCase();
    var results = [];
    for (var i = 0; i < this.objects.length; i++) {
      var item = this.objects[i];
      if (item[this.title] && item[this.title].toLowerCase().indexOf(filter) > -1) {
        results.push(item);
      }
      if (results.length == limit) {
        break;
      }
    }
    this.list = results;
    this.loading = false;
  }

  cancel() {
    this.viewctrl.dismiss(null, "cancel");
  }

  select(item) {
    if (this.multiple) {
      item._selected = !item._selected;
    } else {
      this.viewctrl.dismiss(item, "accept");
    }
  }
  save() {
    var objects = this.objects.filter((i) => {
      return i._selected;
    });
    this.viewctrl.dismiss(objects, "accept");
  }
}
