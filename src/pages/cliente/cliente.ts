import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Api } from "../../providers/api/api";
import { TicketPage } from "../ticket/ticket";
import { Consulta } from "../consulta/consulta";
import { Proceso } from "../proceso/proceso";
import { ProcesoMasivoPage } from "../proceso-masivo/proceso-masivo";
@Component({
  selector: "page-cliente",
  templateUrl: "cliente.html"
})
export class Cliente {
  cliente: any;
  procesos = [];
  consultas = [];
  pedidos = [];
  tickets = [];
  query = "";
  constructor(public navCtrl: NavController, public api: Api, public params: NavParams) {
    this.cliente = this.params.get("cliente");
    this.procesos = this.cliente.procesos;
    this.consultas = this.cliente.consultas;
    if (this.api.user.modulos.pedidos) {
      this.api
        .get(`pedidos?where[cliente_id]=${this.cliente.id}&limit=50&order[fecha_pedido]=desc&with[]=items`)
        .then((resp: any) => {
          this.pedidos = resp;
        })
        .catch((err) => {
          this.api.error(err);
        });
    }
    if (this.api.user.modulos.tickets) {
      this.api
        .get(`tickets?where[cliente_id]=${this.cliente.id}&limit=50&order[created_at]=desc&with[]=comentarios.user`)
        .then((resp: any) => {
          this.tickets = resp;
        })
        .catch((err) => {
          this.api.error(err);
        });
    }
  }

  ionViewDidLoad() {}

  verTicket(ticket_id) {
    this.navCtrl.push(TicketPage, { ticket: { id: ticket_id } });
  }

  verProceso(proceso) {
    this.navCtrl.push(Proceso, { proceso: proceso, cliente: this.cliente });
  }

  verConsulta(consulta) {
    this.navCtrl.push(Consulta, { consulta: consulta, cliente: this.cliente });
  }

  verPedido(pedido) {
    this.navCtrl.push("PedidoPage", { pedido: pedido });
  }

  filtrar() {
    if (this.query == "") {
      this.procesos = this.cliente.procesos.slice(0);
      this.consultas = this.cliente.consultas.slice(0);
      return;
    }

    this.procesos = this.cliente.procesos.filter((proceso) => {
      return (
        proceso.radicado.indexOf(this.query) > -1 ||
        (proceso.ticket && proceso.ticket.titulo.toLowerCase().indexOf(this.query) > -1) ||
        (proceso.ticket && proceso.ticket.contenido.toLowerCase().indexOf(this.query) > -1) ||
        (proceso.ticket && proceso.ticket.categoria && proceso.ticket.categoria.nombre.toLowerCase().indexOf(this.query) > -1)
      );
    });
    this.consultas = this.cliente.consultas.filter((consulta) => {
      return (
        consulta.consulta.indexOf(this.query) > -1 ||
        (consulta.ticket && consulta.ticket.titulo.toLowerCase().indexOf(this.query) > -1) ||
        (consulta.ticket && consulta.ticket.contenido.toLowerCase().indexOf(this.query) > -1) ||
        (consulta.ticket && consulta.ticket.categoria && consulta.ticket.categoria.nombre.toLowerCase().indexOf(this.query) > -1)
      );
    });
  }

  verProcesoMasivo(proceso) {
    this.navCtrl.push(ProcesoMasivoPage, { proceso: proceso, cliente: this.cliente });
  }
}
