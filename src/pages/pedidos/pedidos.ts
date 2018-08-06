import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, AlertController } from "ionic-angular";
import { Api } from "../../providers/api/api";
@IonicPage()
@Component({
  selector: "page-pedidos",
  templateUrl: "pedidos.html"
})
export class PedidosPage {
  _pedidos = { data: [] };
  pedidos = [];
  query = "";
  loading = true;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alert: AlertController, public api: Api) {}

  ionViewDidLoad() {
    this.getPedidos();
  }

  getPedidos() {
    this.loading = true;
    var uri = `pedidos?paginate=50&order[fecha_pedido]=desc&with[]=user&with[]=cliente&with[]=invoice&with[]=entidad&with[]=items`;
    if (this.query !== "") {
      uri += `&orWhereLike[numero_pedido]=${this.query}&orWhereLike[id]=${this.query}`;
    }
    this.api.ready.then(() => {
      this.api
        .get(uri)
        .then((resp: any) => {
          this._pedidos = resp;
          this.filter();
          this.loading = false;
        })
        .catch((err) => {
          this.api.error(err);
        });
    });
  }

  filter() {
    if (this.query == "") {
      return (this.pedidos = this._pedidos.data);
    }
    var q = this.query.toLowerCase();
    this.pedidos = this._pedidos.data.filter((ped) => {
      return (
        ped.numero_pedido.toLowerCase().indexOf(q) > -1 ||
        (ped.estado && ped.estado.toLowerCase().indexOf(q) > -1) ||
        (ped.tipo && ped.tipo.toLowerCase().indexOf(q) > -1) ||
        (ped.user && ped.user.nombre && ped.user.nombre.toLowerCase().indexOf(q) > -1) ||
        (ped.cliente && ped.cliente.nombres && ped.cliente.nombres.toLowerCase().indexOf(q) > -1) ||
        (ped.entidad && ped.entidad.name && ped.entidad.name.toLowerCase().indexOf(q) > -1)
      );
    });
  }

  selectPedido(pedido) {
    this.navCtrl.push("PedidoPage", { pedido: pedido, edition: true });
  }

  addPedido() {
    this.navCtrl.push("PedidoPage", { pedido: null, edition: true });
  }

  confirmDelete(pedido, index) {
    this.alert
      .create({
        title: "Esta seguro de que quiere borrar este elemento?",
        buttons: [
          {
            text: "Borrar",
            handler: () => {
              this.deletePedido(pedido, index);
            }
          },
          "Cancelar"
        ]
      })
      .present();
  }

  deletePedido(pedido, index) {
    this.loading = true;
    this.api
      .delete("pedidos/" + pedido.id)
      .then((resp) => {
        this.pedidos.splice(index, 1);
        this.loading = false;
      })
      .catch((err) => {
        this.api.error(err);
        this.loading = false;
      });
  }
}
