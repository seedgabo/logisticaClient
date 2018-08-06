import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { Api } from "../../providers/api/api";
import { Cliente } from "../cliente/cliente";
@Component({
  selector: "page-clientes",
  templateUrl: "clientes.html"
})
export class Clientes {
  clientes: any = [];
  query = "";
  loading = true;
  constructor(public navCtrl: NavController, public api: Api) {}

  ionViewDidLoad(refresher = null) {
    this.api.ready.then(() => {
      this.get()
        .then(() => {
          if (refresher) refresher.complete();
        })
        .catch((err) => {
          if (refresher) refresher.complete();
        });
    });
  }

  get(search = []) {
    var uri = "clientes?paginate=100";
    for (let i = 0; i < search.length; i++) {
      uri += `&orWhereLike[${search[i].index}]=${search[i].value}`;
    }
    var promise = this.api.get(uri);
    promise
      .then((resp: any) => {
        this.clientes = resp.data;
      })
      .catch((err) => {
        this.api.error(err);
      });
    return promise;
  }

  buscar() {
    let searcher = [
      { index: "nombres", value: this.query },
      { index: "apellidos", value: this.query },
      { index: "nit", value: this.query },
      { index: "cedula", value: this.query }
    ];
    this.get(searcher);
  }

  verCliente(cliente) {
    this.navCtrl.push(Cliente, { cliente: cliente });
  }

  swipe(event) {
    if (event.direction === 2) {
      this.navCtrl.parent.select(2);
    }
  }
}
