import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { SuppliersPage } from "./suppliers";
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [SuppliersPage],
  imports: [IonicPageModule.forChild(SuppliersPage), PipesModule]
})
export class SuppliersPageModule {}
