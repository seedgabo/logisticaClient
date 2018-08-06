import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {TicketPage} from '../ticket/ticket';
import {Api} from '../../providers/api/api';


@Component({
    selector: 'cliente-consulta',
    templateUrl : `consulta.html`
})
export class Consulta{
    consulta:any;
    cliente:any;
    constructor(public navCtrl:NavController, public api:Api, public params:NavParams){
        this.consulta = params.get('consulta');
        console.log(this.consulta);
    }

    verTicket(ticket_id){
        this.navCtrl.push(TicketPage,{ticket:{id: ticket_id}});
    }
}
