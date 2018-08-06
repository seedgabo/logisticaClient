import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import {Api} from '../../providers/api/api';
import {IncapacidadPage} from '../incapacidad/incapacidad';
@Component({
  templateUrl: 'incapacidades.html',
})
export class IncapacidadesPage {
    incapacidades:any;
    paciente:any;
  constructor(public navCtrl: NavController, public api:Api, public params:NavParams) {
      this.paciente = params.get("paciente");
      this.incapacidades = params.get("incapacidades");
  }

  verIncapacidad(incap){
      this.navCtrl.push(IncapacidadPage,{incapacidad : incap});
  }

}
