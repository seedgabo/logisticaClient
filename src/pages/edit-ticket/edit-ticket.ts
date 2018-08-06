import { Component } from '@angular/core';
import { NavController, NavParams, ViewController ,LoadingController } from 'ionic-angular';
import {Api} from '../../providers/api/api';
declare var moment:any;
@Component({
  templateUrl: 'edit-ticket.html',
})
export class EditTicketPage {

    ticket:any;
    usuarios:any;
    contenido:any;
    guardian_id:number;
    estado:string;
    vencimiento:string;
  constructor(public navCtrl: NavController , params:NavParams, public api:Api, public viewctrl: ViewController, public loading:LoadingController) {
      this.ticket = params.get("ticket");
      this.getUsuarios(this.ticket.categoria_id);
      this.guardian_id = this.ticket.guardian_id;
      this.contenido = this.ticket.contenido;
      this.estado = this.ticket.estado;
      this.vencimiento =  moment(this.ticket.vencimiento).format();
  }

  getUsuarios(categoria_id){
      this.api.getUsuariosCategoria(categoria_id).then((data:any)=>{
          this.usuarios = data;
      });
  }


  dismiss(){
      this.viewctrl.dismiss({agregado: false});
  }

  putTicket(){
      let data = `contenido=${this.contenido}&guardian_id=${this.guardian_id}&vencimiento=${this.vencimiento}&estado=${this.estado}`;
      let loading =this.loading.create({content: "Actualizando Caso"})
      loading.present();
      this.api.putTicket(data, this.ticket.id).then((data)=>{
          loading.dismiss().then(()=>{
              this.viewctrl.dismiss({agregado: true});
          });
      });
  }
}
