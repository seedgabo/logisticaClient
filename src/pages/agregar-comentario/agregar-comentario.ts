import { Component } from "@angular/core";
import { ViewController, NavParams, LoadingController, AlertController, ToastController } from "ionic-angular";
import { Api } from "../../providers/api/api";
@Component({
  templateUrl: "agregar-comentario.html"
})
export class AgregarComentarioPage {
  ticket: any;
  texto: string = "";
  file: string = null;
  file_name;
  clave: string = "";
  nombre: string = "";
  constructor(
    public api: Api,
    public viewctrl: ViewController,
    params: NavParams,
    public loading: LoadingController,
    public alert: AlertController,
    public toast: ToastController
  ) {
    this.ticket = params.get("ticket");
  }

  dismiss() {
    this.viewctrl.dismiss({ agregado: false });
  }

  agregarComentario() {
    let loading = this.loading.create({ content: "Agregando Seguimiento" });
    loading.present();
    let data = { texto: this.texto };
    this.api
      .postComentarioTicket(data, this.ticket.id)
      .then((data) => {
        loading.dismiss();
        if (this.file) {
          this.uploadFile(data);
        }
        this.viewctrl.dismiss({ agregado: true });
      })
      .catch((err) => {
        this.api.error(err);
      });
  }

  pickFile() {
    var filer: any = document.querySelector("#input-file-comment");
    filer.click();
  }

  readFile(event) {
    try {
      var reader: any = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      if (event.target.files[0].size / 1024 / 1024 > 5) {
        return this.errorFile(event.target.files[0].size);
      }
      this.file = event.target.files[0];
      this.file_name = event.target.files[0].name;
    } catch (error) {
      this.file = null;
      console.error(error);
    }
  }

  errorFile(size) {
    this.toast
      .create({
        message: "los archivos deben sen inferior a 5MB, (" + size / 1024 / 1024 + " MB)",
        duration: 4000
      })
      .present();
  }

  uploadFile(comment) {
    var formData = new FormData();
    var xhr = new XMLHttpRequest();
    xhr.open("POST", this.api.url + "api/uploadFile/comentario/" + comment.id, true);
    formData.append("file", this.file, this.file_name);
    var toast = this.toast.create({
      message: "Subiendo Archivo",
      position: "top"
    });

    toast.present();
    xhr.onload = () => {
      if (xhr.status === 200) {
        toast.dismiss().then(() => {
          this.toast
            .create({
              message: "Subido Correctamente",
              duration: 1500,
              showCloseButton: true
            })
            .present();
        });
        comment.archivo = this.file;
        this.file = null;
        this.file_name = null;
      } else {
        toast.dismiss();
        this.api.error({ status: xhr.status });
      }
    };
    xhr.setRequestHeader("Auth-Token", this.api.user.token);
    xhr.send(formData);
  }
}
