import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import {Api} from '../../providers/api/api';
@Component({
  templateUrl: 'incapacidad.html',
})
export class IncapacidadPage {
  incapacidad:any
  constructor(public navCtrl: NavController, public api:Api, public params:NavParams) {
      this.incapacidad = params.get('incapacidad');
      this.getIncapacidad();
  }

  getIncapacidad()
  {
      this.api.getIncapacidad(this.incapacidad.id).then((data:any)=>{
          this.incapacidad = data.incapacidad;
      })
  }

}
