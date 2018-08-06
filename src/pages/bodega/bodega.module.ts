import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { BodegaPage } from "./bodega";
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [BodegaPage],
  imports: [IonicPageModule.forChild(BodegaPage), PipesModule]
})
export class BodegaPageModule {}
