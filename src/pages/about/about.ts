import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { Api } from "../../providers/api/api";
import { DocumentosPage } from "../documentos/documentos";
@Component({
  templateUrl: "about.html"
})
export class AboutPage {
  categorias: any;
  constructor(public navCtrl: NavController, public api: Api) {}

  ionViewDidLoad() {
    this.getCategorias();
  }

  getCategorias(refresher = null) {
    this.api
      .getCategoriasDocumentos()
      .then((data: any) => {
        this.categorias = data;
        if (refresher) refresher.complete();
      })
      .catch((err) => {
        if (refresher) refresher.complete();
        this.api.error(err);
      });
  }

  navigate(cat) {
    this.navCtrl.push(DocumentosPage, { categoria: cat });
  }

  swipe(event) {
    if (event.direction === 2) {
      this.navCtrl.parent.select(2);
    }
    if (event.direction === 4) {
      this.navCtrl.parent.select(0);
    }
  }
}
