import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {TicketPage} from '../ticket/ticket';
import {DocumentosPage} from '../documentos/documentos';
import {Api} from '../../providers/api/api';
declare var window:any;
@Component({
    templateUrl: 'buscador.html',
})
export class BuscadorPage {
    tickets:any;
    documentos:any;
    query:string="";
    loading:boolean=false;
    empty:boolean = false;
    constructor(public navCtrl: NavController, public api:Api) {

    }

    ngAfterViewInit(){
        window.setTimeout(()=>{
            window.document.getElementsByClassName('searchbar-input')[0].focus();
        },1000);
    }

    buscar(){
        this.loading = true;
        this.api.getSearch(this.query).then((data:any) =>{
            this.tickets = data.tickets;
            this.documentos = data.documentos;
            if(data.tickets.length == 0 && data.documentos.length == 0)
                this.empty = true;
            else
                this.empty = false;

            this.loading = false;
        });
    }

    openTicket(ticket){
        this.navCtrl.push(TicketPage,{ticket: ticket});
    }

    openCategoriaDocumento(documento){
        this.navCtrl.push(DocumentosPage,{categoria: documento.categoria});
    }
}
