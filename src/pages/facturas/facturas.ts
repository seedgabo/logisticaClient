import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Api } from '../../providers/api/api';
import {Invoice} from '../invoice/invoice';
declare var moment:any;
@Component({
  selector: 'page-facturas',
  templateUrl: 'facturas.html'
})
export class Facturas {
  facturas:any;
  constructor(public navCtrl: NavController, public api:Api) {}

  ionViewDidLoad() {
      this.api.getFacturasClientes().then((data)=>{
          this.facturas = data;
          this.facturas.forEach((factura)=>{
              factura.items = JSON.parse(factura.items);
          })
      }).catch((err)=>{
          console.error("no se pudo descargar las facturas");
      })
  }

  fechar(fecha){
      return moment(fecha).format("dddd,D MMMM  YYYY, h:mm:ss a");
  }

  verInvoice(factura){
      this.navCtrl.push(Invoice,{invoice: factura});
  }

}
