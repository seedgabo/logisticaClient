import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import {Api} from '../../providers/api/api';
import {TicketPage} from '../ticket/ticket';
import {AgregarTicketPage} from '../agregar-ticket/agregar-ticket';
declare var moment:any;
@Component({
    templateUrl: 'categoria.html',
})
export class CategoriaPage {
    api:Api
    categoria:any;
    tickets:any;
    categorias:any;
    constructor(public navCtrl: NavController, params:NavParams, api:Api, public modal:ModalController) {
        this.api = api;
        this.categoria = params.get('categoria');
        this.getTickets();
    }

    getTickets(){
        this.api.getTickets(this.categoria.id).then((data:any)=>{
            this.tickets = data.tickets;
            this.categorias = data.categorias;
        });
    }

    doRefresh(refresher){
        this.api.getTickets(this.categoria.id).then((data:any)=>{
            this.tickets = data.tickets;
            this.categorias = data.categorias;
            refresher.complete();
        });
    }

    navigate(ticket){
        this.navCtrl.push(TicketPage,{ticket: ticket});
    }

    navigateToCat(cat){
        this.navCtrl.push(CategoriaPage,{categoria: cat});
    }

    agregarTicket(categoria){
        let modal =this.modal.create(AgregarTicketPage,{categoria: categoria});
        modal.present();
        modal.onDidDismiss(()=>{
            this.getTickets();
        });

    }


    fechar(fecha)
    {
        return moment(fecha).format("dddd,D MMMM  YYYY, h:mm:ss a");
    }

}
