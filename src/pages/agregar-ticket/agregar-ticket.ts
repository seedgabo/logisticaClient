import { NavController, ViewController, NavParams, LoadingController, AlertController, Platform, ToastController } from "ionic-angular";
import { Api } from "../../providers/api/api";
import { Component } from "@angular/core";
import moment from "moment";
import { TicketPage } from "../ticket/ticket";
moment.locale("es");
@Component({
  templateUrl: "agregar-ticket.html"
})
export class AgregarTicketPage {
  categorias: any;
  usuarios: any;
  clientes;
  file;
  file_name;
  nombre;
  ticket: any = {
    titulo: "",
    contenido: "",
    guardian_id: "",
    transferible: "",
    categoria_id: "",
    clave: "",
    vencimiento: null,
    cliente_id: "",
    tipo: ""
  };

  proceso: any = {
    fecha_proceso: new Date(new Date().getTime() + 60 * 60 * 24 * 1000).toISOString()
  };
  consulta: any = {
    fecha_consulta: new Date(new Date().getTime() + 60 * 60 * 24 * 1000).toISOString()
  };

  constructor(
    public navCtrl: NavController,
    public viewctrl: ViewController,
    public api: Api,
    params: NavParams,
    public loading: LoadingController,
    public alert: AlertController,
    public platform: Platform,
    public toast: ToastController
  ) {
    this.getCategorias();
    this.api.get("clientes").then((data: any) => {
      this.clientes = data;
    });
  }

  getUsuarios(categoria_id) {
    this.api.getUsuariosCategoria(categoria_id).then((data: any) => {
      this.usuarios = data;
      if (data[0]) this.ticket.guardian_id = data[0].id;
    });
  }

  getCategorias() {
    this.api
      .getAllCategorias()
      .then((data) => {
        this.categorias = data;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  reloadUsuarios() {
    this.getUsuarios(this.ticket.categoria_id);
  }

  dismiss() {
    this.viewctrl.dismiss({ agregado: false });
  }

  agregarTicket() {
    let loading = this.loading.create({ content: "Cargando" });
    loading.present();
    var data: any = this.ticket;
    if (data.vencimiento) {
      data.vencimiento = moment(data.vencimiento)
        .utc()
        .format("YYYY-MM-DD HH:mm:ss");
    }
    if (this.ticket.tipo == "proceso") {
      data.proceso = this.proceso;
      if (data.proceso.fecha_proceso != undefined) {
        data.proceso.fecha_proceso = moment(data.proceso.fecha_proceso).format("X");
      }
    }
    if (this.ticket.tipo == "consulta") {
      data.consulta = this.consulta;
      if (data.consula.fecha_consulta != undefined) {
        data.consula.fecha_consulta = moment(data.consulta.fecha_consulta).format("X");
      }
    }
    this.api
      .post("tickets", data)
      .then((data) => {
        if (this.file) {
          this.uploadFile(data);
        }
        loading.dismiss();
        this.viewctrl.dismiss({ agregado: true, ticket: data }).then(() => {
          this.navCtrl.push(TicketPage, { ticket: data });
        });
      })
      .catch((err) => {
        loading.dismiss();
        this.api.error(err);
      });
  }

  rellenado() {
    return !(this.ticket.titulo.length > 3 && this.ticket.contenido.length > 3 && this.ticket.guardian_id != "");
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

  uploadFile(ticket) {
    var formData = new FormData();
    var xhr = new XMLHttpRequest();
    xhr.open("POST", this.api.url + "api/uploadFile/ticket/" + ticket.id, true);
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
        ticket.archivo = this.file;
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
