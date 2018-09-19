import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { BodegueroHomePage } from "./bodeguero-home";
import { MomentModule } from "angular2-moment";

@NgModule({
  declarations: [BodegueroHomePage],
  imports: [IonicPageModule.forChild(BodegueroHomePage), MomentModule]
})
export class BodegueroHomePageModule {}
