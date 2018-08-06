import { Component } from "@angular/core";
import { Platform, NavController, NavParams, ModalController, ToastController, AlertController } from "ionic-angular";
import { FileTransfer } from "@ionic-native/file-transfer";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { Api } from "../../providers/api/api";
import { AgregarComentarioPage } from "../agregar-comentario/agregar-comentario";
import { EditTicketPage } from "../edit-ticket/edit-ticket";
declare var cordova: any;
declare var moment: any;
@Component({
  templateUrl: "ticket.html"
})
export class TicketPage {
  api: Api;
  ticket: any;
  comentarios: any;
  loading: string = "";
  datos: boolean = false;
  colors = [
    {
      color: "#0057e7",
      name: "Azul"
    },
    {
      color: "#008744",
      name: "Verde"
    },
    {
      color: "#d62d20",
      name: "Rojo"
    },
    {
      color: "#ffa700",
      name: "Amarillo"
    },
    {
      color: "#7986cb",
      name: "Purpura"
    },
    {
      color: "#1de8b5",
      name: "Manzana"
    },
    {
      color: "#000",
      name: "Negro"
    },
    {
      color: "Gris",
      name: "#555"
    }
  ];
  addingTag = false;
  tag = {
    color: "#0057e7",
    value: ""
  };
  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public transfer: FileTransfer,
    public inappbrowser: InAppBrowser,
    params: NavParams,
    api: Api,
    public modal: ModalController,
    public toast: ToastController,
    public alert: AlertController
  ) {
    this.api = api;
    this.ticket = params.get("ticket");
    console.log(this.ticket);
    this.getTicket();
  }

  getTicket() {
    this.api
      .getTicket(this.ticket.id)
      .then((data: any) => {
        this.ticket = data.ticket;
        console.log(this.ticket);
        this.comentarios = data.comentarios;
      })
      .catch((err) => {
        this.toast
          .create({ message: "No se pudo cargar la pagina", duration: 3000, dismissOnPageChange: false, showCloseButton: true })
          .present();
        this.navCtrl.pop();
      });
  }

  doRefresh(refresher) {
    this.api.getTicket(this.ticket.id).then((data: any) => {
      this.ticket = data.ticket;
      this.comentarios = data.comentarios;
      refresher.complete();
    });
  }

  agregarComentario() {
    let modal = this.modal.create(AgregarComentarioPage, { ticket: this.ticket });
    modal.present();
    modal.onDidDismiss((data: any) => {
      if (data.agregado == true) this.getTicket();
    });
  }

  eliminarcomentario(comentario) {
    this.api.deleteComenarioTicket(comentario.id).then((data) => {
      this.getTicket();
    });
  }

  editTicket() {
    let modal = this.modal.create(EditTicketPage, { ticket: this.ticket });
    modal.present();
    modal.onDidDismiss((data: any) => {
      this.getTicket();
    });
  }
  // Descargas de ticket

  descargarArchivoTicketold() {
    let dir;
    if (this.platform.is("android")) dir = cordova.file.externalApplicationStorageDirectory;
    else dir = cordova.file.documentsDirectory;
    let fileTransfer = this.transfer.create();
    let uri = encodeURI(this.ticket.path);
    let headers = {};
    headers = { Authorization: "Basic " + btoa(this.api.username + ":" + this.api.password) };
    this.loading = "Descargando Archivo";
    fileTransfer
      .download(uri, dir + this.ticket.archivo, true, {
        headers: headers
      })
      .then((entry) => {
        this.toast.create({ message: "Archivo Descargado", duration: 1500, position: "bottom" }).present();
        this.abrirDocClasico(dir + this.ticket.archivo, this.ticket.mime);
      })
      .catch((error) => {
        this.toast.create({ message: error.message, duration: 6000, position: "bottom" }).present();
        this.loading = "";
      });
  }

  descargarArchivoTicket() {
    let url = encodeURI(this.ticket.path);
    this.inappbrowser.create(url, "_system");
  }

  preguntarClave() {
    let alert = this.alert.create({
      title: "Introduzca La clave:",
      inputs: [
        {
          name: "clave",
          placeholder: "Password",
          type: "password"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: (data) => {
            console.log("Cancel clicked");
          }
        },
        {
          text: "Descargar",
          handler: (data) => {
            this.descargarArchivoEncriptado(data.clave);
          }
        }
      ]
    });
    alert.present();
  }

  descargarArchivoEncriptadoold(clave) {
    let dir;
    if (this.platform.is("android")) dir = cordova.file.externalApplicationStorageDirectory;
    else dir = cordova.file.documentsDirectory;
    let fileTransfer = this.transfer.create();
    let uri = encodeURI(this.api.url + "api/getEncryptedFile/ticket/" + this.ticket.id + "/" + clave);
    let headers = {};
    headers = { Authorization: "Basic " + btoa(this.api.username + ":" + this.api.password) };
    this.loading = "Descargando Archivo";
    fileTransfer
      .download(uri, dir + this.ticket.archivo, true, {
        headers: headers
      })
      .then((entry) => {
        this.toast.create({ message: "Archivo Descargado", duration: 5000, position: "bottom" }).present();
        this.abrirDocClasico(dir + this.ticket.archivo, this.ticket.mime);
      })
      .catch((error) => {
        this.toast.create({ message: error.message, duration: 6000, position: "bottom" }).present();
        this.loading = "";
      });
  }

  descargarArchivoEncriptado(clave) {
    let url = encodeURI(this.api.urlAuth("api/getEncryptedFile/ticket/" + this.ticket.id + "/" + clave));
    this.inappbrowser.create(url, "_system");
  }

  // Descargas de Comentarios
  descargarArchivoComentarioold(comentario) {
    let dir;
    if (this.platform.is("android")) dir = cordova.file.externalApplicationStorageDirectory;
    else dir = cordova.file.documentsDirectory;
    let fileTransfer = this.transfer.create();
    let uri = encodeURI(comentario.path);
    let headers = {};
    headers = { Authorization: "Basic " + btoa(this.api.username + ":" + this.api.password) };
    this.loading = "Descargando Archivo";
    fileTransfer
      .download(uri, dir + comentario.archivo, true, {
        headers: headers
      })
      .then((entry) => {
        this.toast.create({ message: "Archivo Descargado", duration: 1500, position: "bottom" }).present();
        this.abrirDocClasico(dir + comentario.archivo, comentario.mime);
      })
      .catch((error) => {
        this.toast.create({ message: error.message, duration: 6000, position: "bottom" }).present();
        this.loading = "";
      });
  }

  descargarArchivoComentario(comentario) {
    let url = encodeURI(comentario.path);
    this.inappbrowser.create(url, "_system");
  }

  preguntarClaveComentario(comentario) {
    let alert = this.alert.create({
      title: "Introduzca La clave:",
      inputs: [
        {
          name: "clave",
          placeholder: "Password",
          type: "password"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: (data) => {
            console.log("Cancel clicked");
          }
        },
        {
          text: "Descargar",
          handler: (data) => {
            this.descargarArchivoComentarioEncriptado(comentario, data.clave);
          }
        }
      ]
    });
    alert.present();
  }

  descargarArchivoComentarioEncriptado(comentario, clave) {
    let url = encodeURI(this.api.urlAuth("api/getEncryptedFile/comentario/" + comentario.id + "/" + clave));
    this.inappbrowser.create(url, "_system");
  }

  descargarArchivoComentarioEncriptadoold(comentario, clave) {
    let dir;
    if (this.platform.is("android")) dir = cordova.file.externalApplicationStorageDirectory;
    else dir = cordova.file.documentsDirectory;
    let fileTransfer = this.transfer.create();
    let uri = encodeURI(this.api.url + "api/getEncryptedFile/comentario/" + comentario.id + "/" + clave);
    let headers = {};
    headers = { Authorization: "Basic " + btoa(this.api.username + ":" + this.api.password) };
    this.loading = "Descargando Archivo";
    fileTransfer
      .download(uri, dir + comentario.archivo, true, {
        headers: headers
      })
      .then((entry) => {
        this.toast.create({ message: "Archivo Descargado", duration: 1500, position: "bottom" }).present();
        this.abrirDocClasico(dir + comentario.archivo, comentario.mime);
      })
      .catch((error) => {
        this.toast.create({ message: error.message, duration: 6000, position: "bottom" }).present();
        this.loading = "";
      });
  }

  fechar(fecha) {
    return moment(fecha).format("dddd,D MMMM  YYYY, h:mm:ss a") == "Invalid date"
      ? "No Vence"
      : moment(fecha).format("dddd,D MMMM  YYYY, h:mm:ss a");
  }

  abrirDocClasico(path, mime) {
    console.log(path);
    this.loading = "Abriendo Archivo";
    let opener: string = this.getFileOpener(mime);

    cordova.plugins.fileOpener2.open(path, opener, {
      error: (e) => {
        if (e.status == 9)
          this.alert
            .create({ title: "Error", message: "Debe Descargar una aplicación para abrir este archivo", buttons: ["ok"] })
            .present();
        else
          this.alert
            .create({ title: "Error", message: "Error status: " + e.status + " - Error message: " + e.message, buttons: ["ok"] })
            .present();
        this.loading = "";
      },
      success: () => {
        this.toast.create({ message: "Abriendo Archivo", duration: 1500, position: "bottom" }).present();
        this.loading = "";
      }
    });
  }

  getFileOpener(mime) {
    if (mime == "pdf") return "application/pdf";

    if (mime == "xls") return "application/vnd.ms-excel";

    if (mime == "xlsx") return "application/vnd.ms-excel";

    if (mime == "doc" || mime == "docx") return "application/msword";

    if (mime == "txt") return "text/plain";

    if (mime == "ppt" || mime == "pptx") return "application/vnd.ms-powerpoint";

    if (mime == "png") return "image/png";

    if (mime == "jpg" || mime == "jpeg") return "image/jpg";
  }

  addtag() {
    this.api
      .post(`tickets/${this.ticket.id}/addTag`, {
        tag: this.tag
      })
      .then((data: any) => {
        this.ticket.tags = data.tags;
        this.tag.value = "";
      })
      .catch((err) => {
        this.api.error(err);
      });

    this.addingTag = false;
  }

  removeTag(tag, i) {
    console.log(tag);
    this.api
      .post(`tickets/${this.ticket.id}/removeTag/${i}`, {})
      .then((data: any) => {
        this.ticket.tags = data.tags;
        this.tag.value = "";
      })
      .catch((err) => {
        this.api.error(err);
      });
    this.addingTag = false;
  }
}
