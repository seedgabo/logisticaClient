import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Api } from "../../providers/api/api";
@IonicPage()
@Component({
  selector: "page-sign-recolector",
  templateUrl: "sign-recolector.html"
})
export class SignRecolectorPage {
  list = [];
  _list: any = null;
  loading = false;
  item = {
    user_id: null,
    signature: null,
    entidad_id: null,
    note: "Control"
  };
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {}

  ionViewDidLoad() {
    this.api.ready.then(() => {
      this.api.load("entidades");
      this.api.load("users");
      this.getData();
    });
  }

  getData(refresher = null) {
    this.loading = true;
    this.api
      .get("annotations?order[created_at]=desc&paginate=100&with[]=user&with[]=entidad&with[]=image")
      .then((resp: any) => {
        this.list = resp.data;
        this._list = resp;
        if (refresher) refresher.complete();
        this.loading = false;
      })
      .catch((err) => {
        if (refresher) refresher.complete();
        this.loading = false;
        this.api.error(err);
      });
  }

  uploadAnnotation() {
    console.log(this.item);
    this.loading = true;
    var data = {
      user_id: this.item.user_id,
      entidad_id: this.item.entidad_id,
      note: "Control"
    };
    this.api
      .post("annotations?with[]=user&with[]=entidad", data)
      .then((data: any) => {
        this.api
          .post(`images/upload/annotation/${data.id}`, { image: this.item.signature })
          .then((response: any) => {
            console.log("signature response:", response);
            this.loading = false;
            data.image = response.image;
            data.image_id = response.image.id;
            this.item.signature = null;
            this.list.unshift(data);
          })
          .catch((err) => {
            this.loading = false;
            this.api.error(err);
          });
      })
      .catch((err) => {
        this.loading = false;
        this.api.error(err);
      });
  }

  deleteAnnotation(id) {
    this.api
      .delete("annotations/" + id)
      .then(() => {
        var i = this.list.findIndex((item) => {
          return item.id == id;
        });
        if (i > -1) this.list.splice(i, 1);
      })
      .catch((err) => {
        this.api.error(err);
      });
  }
}
