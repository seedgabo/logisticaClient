import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ToastController } from "ionic-angular";
import { Api } from "../../providers/api/api";
@IonicPage()
@Component({
  selector: "page-annotations",
  templateUrl: "annotations.html"
})
export class AnnotationsPage {
  annotations = [];
  loading = false;
  note = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, public toast: ToastController, public api: Api) {}

  ionViewDidLoad() {
    this.api.ready.then(() => {
      this.getData();
    });
  }
  getData(refresher = null) {
    this.loading = true;
    this.api
      .get(`annotations?limit=300&where[created_by]=${this.api.user.id}&order[created_at]=desc&with[]=user&with[]=entidad`)
      .then((resp: any) => {
        this.loading = false;
        this.annotations = resp;
        if (refresher) refresher.complete();
      })
      .catch((err) => {
        this.loading = false;
        this.api.error(err);
      });
  }
  postNote() {
    var data = {
      note: this.note,
      entidad_id: this.api.user.entidad_id,
      user_id: this.api.user.id
    };
    this.loading = true;
    this.api
      .post("annotations", data)
      .then((resp) => {
        this.annotations.unshift(resp);
        this.loading = false;
        this.note = "";
        this.toast
          .create({
            duration: 1000,
            message: this.api.trans("literals.annotation") + " " + this.api.trans("crud.created"),
            position: "top"
          })
          .present();
      })
      .catch((err) => {
        this.api.error(err);
        this.loading = false;
      });
  }
}
