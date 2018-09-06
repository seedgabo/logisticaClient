import { Injectable } from "@angular/core";
import { Platform, AlertController } from "ionic-angular";
import { Push } from "@ionic-native/push";
import { FileTransfer } from "@ionic-native/file-transfer";
import { Http, Headers } from "@angular/http";
// import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { Storage } from "@ionic/storage";
declare var window: any;
@Injectable()
export class Api {
  username: string;
  password: string;
  token: string;
  url: string = "http://newton.eycproveedores.com/newton/public/";
  user: any = null;
  pushData: any;
  objects: any = {};
  langs = {};
  resolve;
  ready = new Promise((resolve) => {
    this.resolve = resolve;
  });
  storage = {
    ready: () => {
      return this._storage.ready();
    },
    get: (key) => {
      var prefix = window.url ? window.url : "";
      return this._storage.get(prefix + key);
    },
    set: (key, value) => {
      var prefix = window.url ? window.url : "";
      return this._storage.set(prefix + key, value);
    },
    remove: (key) => {
      var prefix = window.url ? window.url : "";
      return this._storage.remove(prefix + key);
    },
    clear: () => {
      return this._storage.clear();
    }
  };
  constructor(
    public http: Http,
    private platform: Platform,
    public _storage: Storage,
    public push: Push,
    public transfer: FileTransfer,
    public alert: AlertController
  ) {
    window.$api = this;
    this.initVar();
    this.ready.then(() => {
      if (this.user)
        this.get("lang")
          .then((langs) => {
            this.langs = langs;
          })
          .catch(console.error);
    });
  }

  get(uri) {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.url + "api/" + uri, { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  post(uri, data) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.url + "api/" + uri, data, { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  put(uri, data) {
    return new Promise((resolve, reject) => {
      this.http
        .put(this.url + "api/" + uri, data, { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  delete(uri) {
    return new Promise((resolve, reject) => {
      this.http
        .delete(this.url + "api/" + uri, { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  load(resource) {
    console.time("load " + resource);
    return new Promise((resolve, reject) => {
      if (this.objects[resource]) {
        this.objects[resource].promise
          .then((resp) => {
            resolve(resp);
            console.timeEnd("load " + resource);
          })
          .catch(reject);
        return;
      }
      this.storage.get(resource + "_resource").then((data) => {
        this.objects[resource] = [];
        if (data) {
          this.objects[resource] = data;
        }
        var promise,
          query = "";
        this.objects[resource].promise = promise = this.get(resource + query);
        this.objects[resource].promise
          .then((resp) => {
            this.objects[resource] = resp;
            this.objects[resource].promise = promise;
            this.objects[resource].collection = this.mapToCollection(resp);
            this.storage.set(resource + "_resource", resp);
            console.timeEnd("load " + resource);
            return resolve(this.objects[resource]);
          })
          .catch((err) => {
            reject(err);
            this.error(err);
          });
      });
    });
  }

  urlAuth(uri) {
    return this.url + uri;
  }

  initVar() {
    this.storage.get("url").then((data) => {
      if (window.url) {
        this.url = window.url;
      } else {
        this.url = data;
      }
    });
    this.storage.get("username").then((data) => (this.username = data));
    this.storage.get("password").then((data) => (this.password = data));
    this.storage.get("user").then((data) => {
      this.user = data ? data : null;
      this.resolve(this.user);
    });
  }

  saveData() {
    this.storage.set("username", this.username);
    this.storage.set("password", this.password);
    this.storage.set("url", this.url);
  }

  saveUser(user) {
    this.storage.set("user", user);
  }

  doLogin() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.url + "api/login", { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            this.user = data;
            this.saveUser(data);
            this.saveData();
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getCategorias() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.url + "api/getCategorias", { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getUsuarios() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.url + "api/getUsuarios", { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getAllCategorias() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.url + "api/getAllCategorias", { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getTickets(categoria_id) {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.url + "api/" + categoria_id + "/getTickets", { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getCategoriasDocumentos() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.url + "api/documentos/getCategorias", { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getUsuariosCategoria(categoria_id) {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.url + "api/getUsuariosCategoria/" + categoria_id, { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getDocumentos(categoria) {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.url + "api/" + categoria + "/getDocumentos", { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getTicket(ticket_id) {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.url + "api/getTicket/" + ticket_id, { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getMisTickets() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.url + "api/getMisTickets", { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getAllTickets() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.url + "api/getAllTickets", { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getTicketsAbiertos() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.url + "api/getTicketsAbiertos", { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getTicketsVencidos() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.url + "api/getTicketsVencidos", { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getSearch(query) {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.url + "api/search?query=" + query, { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getNotificaciones() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.url + "api/getNotificaciones", { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  leerNotificacion(id) {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.url + "api/notificacion/" + id + "/leida", { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getParameters() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.url + "api/getParameters", { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  desleerNotificacion(id) {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.url + "api/notificacion/" + id + "/noleida", { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  
  getPacientes(query = "") {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.url + "api/getPacientes" + query, { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getCaso(caso_id) {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.url + "api/getCaso/" + caso_id, { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getIncapacidad(incapacidad_id) {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.url + "api/getIncapacidad/" + incapacidad_id, { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  iniciarSeguimiento(caso_id) {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.url + "api/iniciar-seguimiento/" + caso_id, { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  postTicket(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.url + "api/addTicket", data, { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  postComentarioTicket(data, ticket_id) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.url + "api/addComentario/" + ticket_id, data, { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  postAlerta(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.url + "api/addAlerta", data, { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  putTicket(data, id) {
    return new Promise((resolve, reject) => {
      this.http
        .put(this.url + "api/editTicket/" + id, data, { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  deleteComenarioTicket(comentario_id) {
    return new Promise((resolve, reject) => {
      this.http
        .delete(this.url + "api/deleteComenarioTicket/" + comentario_id, { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  postPushtoken(data) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.url + "api/dispositivos", data, { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  pushRegister() {
    let push: any = this.push.init({
      android: {
        senderID: "600000041642",
        clearNotifications: "false"
      },
      ios: {
        alert: "true",
        badge: true,
        sound: "true"
      },
      windows: {}
    });

    if (typeof push.error === "undefined" || push.error === null) {
      let body;
      push.on("registration", (data) => {
        console.log(data.registrationId);
        if (this.platform.is("android")) body = "token=" + data.registrationId + "&plataforma=android";
        else body = "token=" + data.registrationId + "&plataforma=ios";

        this.postPushtoken(body).then((Response) => {
          this.pushData = Response;
          this.savePushData(Response);
        });
      });

      push.on("notification", (data) => {
        console.log(data.message);
        console.log(data.title);
        console.log(data.count);
        console.log(data.sound);
        console.log(data.image);
        console.log(data.additionalData);
      });

      push.on("error", (e) => {
        console.log(e.message);
      });
      return true;
    }
    return false;
  }

  savePushData(pushData) {
    this.storage.set("pushData", JSON.stringify(pushData));
  }

  putPushData(id, data) {
    return new Promise((resolve, reject) => {
      this.http
        .put(this.url + "api/dispositivos/" + id, data, { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  // Clientes Functions
  getTicketsClientes() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.url + "api/clientes/getTickets", { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getFacturasClientes() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.url + "api/clientes/getInvoices", { headers: this.setHeaders() })
        .map((res) => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  error(err) {
    console.error(err);
    this.alert
      .create({
        title: "Error",
        subTitle: err.errorStatus,
        message: err.errorMessage || err.message || JSON.stringify(err),
        buttons: ["OK"]
      })
      .present();
  }

  isSuperAdmin() {
    var is_super = false;
    this.user.roles.forEach((rol) => {
      if (rol.name == "SuperAdmin") {
        is_super = true;
        return is_super;
      }
    });
    return is_super;
  }

  trans(value, replace = {}) {
    if (!this.langs) return value;
    var splits = value.split(".");
    var base, trans;
    if (splits.length == 2) {
      base = this.langs[splits[0]];
      if (base) {
        trans = base[splits[1]];
        if (trans) {
          value = trans;
        }
      }
    } else {
      base = this.langs["__"];
      if (base) {
        trans = base[value];
        if (trans) {
          value = trans;
        }
      }
    }
    for (var key in replace) {
      value = value.replace(":" + key, replace[key]);
    }

    return value.replace("__.", "").replace("literals.", "");
  }

  private setHeaders() {
    let headers = new Headers();
    if (this.user && this.user.token) {
      headers.append("Auth-Token", this.user.token);
    } else {
      headers.append("Authorization", "Basic " + btoa(this.username + ":" + this.password));
    }
    return headers;
  }

  public mapToCollection(array, key = "id") {
    var collection = {};
    array.forEach((element) => {
      collection[element[key]] = element;
    });
    return collection;
  }
}
