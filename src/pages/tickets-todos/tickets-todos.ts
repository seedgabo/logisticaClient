import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Api} from '../../providers/api/api';
@Component({
  templateUrl: 'tickets-todos.html',
})
export class TicketsTodosPage {

    tickets:any;
  constructor(public navCtrl: NavController, public api:Api) {
      this.getMisTickets();
  }
  getMisTickets(){
      this.api.getAllTickets().then((data:any)=>{
          this.tickets = data.tickets;
      });
  }

}
