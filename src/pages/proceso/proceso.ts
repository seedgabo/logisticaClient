import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {TicketPage} from '../ticket/ticket';
import {Api} from '../../providers/api/api';

@Component({
    selector: 'cliente-proceso',
    templateUrl : `proceso.html`
})
export class Proceso{
    proceso:any;
    cliente:any;
    constructor(public navCtrl:NavController, public api:Api, public params:NavParams){
        this.proceso = params.get('proceso');
        console.log(this.proceso);
    }

    verTicket(ticket_id){
        this.navCtrl.push(TicketPage,{ticket:{id: ticket_id}});
    }
}
