import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { TicketPage } from "../ticket/ticket";

// import { Api} from '../../providers/api/api';
declare var moment: any;
@Component({
  templateUrl: "list-ticket.html",
  selector: "list-ticket",
  inputs: ["ticket"]
})
export class listTicket {
  ticket: any;
  constructor(public navCtrl: NavController) {}

  fechar(fecha) {
    var fecha = moment(fecha).format("D MM YYYY, h:mm:ss a");
    return fecha == "Invalid date" ? "No Vence" : fecha;
  }
  navigate(ticket) {
    this.navCtrl.push(TicketPage, { ticket: ticket });
  }
}
