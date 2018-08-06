import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ViewController, ToastController } from "ionic-angular";
import { Api } from "../../providers/api/api";
@IonicPage()
@Component({
  selector: "page-item",
  templateUrl: "item.html"
})
export class ItemPage {
  item: any = {
    item: "",
    descripcion: "",
    estado: true,
    referencia: "",
    bodega_id: null,
    unit_id: null
  };
  bodega = null;
  cliente = null;
  entidad = null;

  loading = false;
  qty = 1;
  file = null;
  file_name = "";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: Api,
    public viewctrl: ViewController,
    public toast: ToastController
  ) {
    if (this.navParams.get("item")) {
      this.item = this.navParams.get("item");
    }
    if (this.navParams.get("bodega")) {
      this.bodega = this.navParams.get("bodega");
      this.item.bodega_id = this.navParams.get("bodega").id;
    }
    console.log(this.item);
    this.api.load("bodegas");
  }

  ionViewDidLoad() {}

  save() {
    var promise;
    var data = {
      item: this.item.item,
      descripcion: this.item.descripcion,
      estado: this.item.estado,
      referencia: this.item.referencia,
      bodega_id: this.item.bodega_id,
      unit_id: this.item.unit_id
    };

    if (this.item.id) {
      promise = this.api.put("items/" + this.item.id, data);
    } else {
      promise = this.api.post("items", data);
    }
    this.loading = true;
    promise
      .then((data) => {
        this.loading = false;
        this.viewctrl.dismiss(data);
        if (!this.item.id && this.qty > 0 && data.bodega_id) {
          this.addEntrada(data).then(() => {
            this.viewctrl.dismiss(data);
          });
        }
        if (this.file) {
          this.uploadFile(data);
        } else {
          this.viewctrl.dismiss(data);
        }
      })
      .catch((err) => {
        this.api.error(err);
        this.loading = false;
      });
    return promise;
  }
  deleteItem() {
    this.api
      .delete("items/" + this.item.id)
      .then((resp) => {
        this.viewctrl.dismiss(null, "deleted");
      })
      .catch((err) => {
        this.api.error(err);
      });
  }

  addEntrada(item) {
    var promise = this.api.post(`inventarios/${item.id}/add/${this.bodega.id}`, {
      secure_mode: false,
      quantity: this.qty,
      cliente_id: this.cliente ? this.cliente.id : undefined,
      entidad_id: this.entidad ? this.entidad.id : undefined
    });
    promise.then((resp) => {}).catch((err) => {
      this.api.error(err);
    });

    return promise;
  }

  dismiss() {
    this.viewctrl.dismiss();
  }

  canSave() {
    return this.item && this.item.item.length > 1;
  }

  askFile() {
    return document.getElementById("input-image").click();
  }
  readFile(evt) {
    try {
      // var reader = new FileReader();
      if (evt.target.files[0].size / 1024 / 1024 > 5) {
        return alert("el archivo es muy grande: " + Math.floor(evt.target.files[0].size) + " (< 5MB)");
      }
      this.file = evt.target.files[0];
      this.file_name = evt.target.files[0].name;
    } catch (error) {
      this.file = null;
      this.file_name = null;
      return console.error(error);
    }
  }
  uploadFile(item) {
    var formData, xhr;
    formData = new FormData();
    xhr = new XMLHttpRequest();
    xhr.open("POST", this.api.url + "api/uploadFile/inventario/" + item.id, true);
    formData.append("file", this.file, this.file_name);
    this.toast
      .create({
        message: "Cargando imagen...",
        duration: 1000
      })
      .present();
    xhr.onload = () => {
      if (xhr.status == 200) {
        this.toast
          .create({
            message: "imagen Cargada",
            duration: 1500
          })
          .present();

        this.item.foto_url = this.api.url + "inventarios/" + this.item.id;
        this.file = null;
        this.file_name = "";
      } else {
        this.api.error(xhr.status);
        return console.error(xhr);
      }
    };
    xhr.setRequestHeader("Auth-Token", this.api.user.token);

    return xhr.send(formData);
  }
}
