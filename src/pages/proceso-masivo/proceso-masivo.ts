import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from '../../providers/api/api';
@Component({
  selector: 'page-proceso-masivo',
  templateUrl: 'proceso-masivo.html'
})
export class ProcesoMasivoPage {

  proceso:any;
  data:any;
  cliente:any;
  fields:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api:Api) {
    this.proceso = navParams.get('proceso');
    this.cliente = navParams.get('cliente');
    this.data = this.proceso.pivot;
    console.log(this.proceso);
  }

  ionViewDidLoad() {
    this.api.get("proceso-masivo-fields").then((data)=>{
      this.fields = Object.keys(data).map((key)=> { data[key].key= key; return data[key]; });;
      console.log(this.fields);
    })
  }

}
