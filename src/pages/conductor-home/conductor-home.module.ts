import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ConductorHomePage } from "./conductor-home";
import { PipesModule } from "../../pipes/pipes.module";
import { MomentModule } from "angular2-moment";

@NgModule({
  declarations: [ConductorHomePage],
  imports: [IonicPageModule.forChild(ConductorHomePage), PipesModule, MomentModule]
})
export class ConductorHomePageModule {}
