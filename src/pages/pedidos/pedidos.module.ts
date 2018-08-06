import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { PedidosPage } from "./pedidos";
import { MomentModule } from "angular2-moment";

@NgModule({
  declarations: [PedidosPage],
  imports: [IonicPageModule.forChild(PedidosPage), MomentModule]
})
export class PedidosPageModule {}
