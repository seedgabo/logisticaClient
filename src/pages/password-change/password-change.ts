import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ToastController, ViewController } from "ionic-angular";
import { Api } from "../../providers/api/api";
@IonicPage()
@Component({
  selector: "page-password-change",
  templateUrl: "password-change.html"
})
export class PasswordChangePage {
  password = "";
  password_confirmation = "";
  loading = false;
  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public api: Api,
    public toast: ToastController
  ) {}

  ionViewDidLoad() {}

  updatePassword() {
    this.loading = true;
    this.api
      .post("changePassword", { password: this.password })
      .then((data) => {
        this.loading = false;
        this.viewCtrl.dismiss();
      })
      .catch((error) => {
        this.loading = false;
      });
  }

  canSave() {
    return this.password == this.password_confirmation && this.password.length > 5;
  }
}
