import { Component } from "@angular/core";
import { NavController, ActionSheetController } from "ionic-angular";
import { Api } from "../../providers/api/api";
import { PacientePage } from "../paciente/paciente";
import { CasosPage } from "../casos/casos";
import { IncapacidadesPage } from "../incapacidades/incapacidades";
@Component({
  templateUrl: "contact.html"
})
export class ContactPage {
  pacientes: any;
  query: any = "";
  buscando: boolean = false;
  constructor(public navCtrl: NavController, public api: Api, public actionsheet: ActionSheetController) {
    this.getPacientes();
  }

  getPacientes() {
    this.api
      .getPacientes()
      .then((data: any) => {
        this.pacientes = data.pacientes;
      })
      .catch((err) => {
        this.api.error(err);
      });
  }

  buscar(searchbar) {
    this.buscando = true;
    this.api
      .getPacientes("?query=" + this.query)
      .then((data: any) => {
        this.pacientes = data.pacientes;
        this.buscando = false;
      })
      .catch((err) => {
        this.api.error(err);
      });
  }

  verPaciente(paciente) {
    this.navCtrl.push(PacientePage, { paciente: paciente });
  }

  verCasos(paciente) {
    this.navCtrl.push(CasosPage, { paciente: paciente, casos: paciente.casos });
  }

  verIncapacidades(paciente) {
    this.navCtrl.push(IncapacidadesPage, { paciente: paciente, incapacidades: paciente.incapacidades });
  }

  verMenu(paciente) {
    let actionSheet = this.actionsheet.create({
      title: "Paciente " + paciente.full_name,
      buttons: [
        {
          icon: "eye",
          text: "Ver",
          handler: () => {
            this.verPaciente(paciente);
          }
        },
        {
          icon: "briefcase",
          text: "Ver Casos",
          handler: () => {
            this.verCasos(paciente);
          }
        },
        {
          icon: "medical",
          text: "Ver Incapacidades",
          handler: () => {
            this.verIncapacidades(paciente);
          }
        },
        {
          icon: "close",
          text: "Cancelar",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });
    actionSheet.present();
  }
}
