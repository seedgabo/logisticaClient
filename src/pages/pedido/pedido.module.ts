import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { PedidoPage } from "./pedido";
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [PedidoPage],
  imports: [IonicPageModule.forChild(PedidoPage), PipesModule]
})
export class PedidoPageModule {}
