import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Api} from '../../providers/api/api';
import {IncapacidadPage} from '../incapacidad/incapacidad';
import {TicketPage} from '../ticket/ticket';
@Component({
  templateUrl: 'caso.html',
})
export class CasoPage {
  caso:any;
  recomendaciones:any;
  incapacidades:any;
  constructor(public navCtrl: NavController, public api:Api, public params:NavParams) {
      this.caso = params.get("caso");
      this.getCaso(this.caso.id);
  }

  getCaso(id){
      this.api.getCaso(id).then((data:any)=>{
          this.caso = data.caso;
          this.recomendaciones = data.recomendaciones;
          this.incapacidades = data.incapacidades;
      })
  }
  verIncapacidad(incap)
  {
      this.navCtrl.push(IncapacidadPage,{incapacidad : incap});
  }

 verSeguimiento(caso)
 {
     this.navCtrl.push(TicketPage,{ticket: {id: caso.ticket_id} })
 }

 iniciarSeguimiento(caso)
 {
     this.api.iniciarSeguimiento(caso.id).then((data:any)=>{
         this.caso.ticket_id = data.id;
         this.navCtrl.push(TicketPage,{ticket: data });
     })
 }
}
