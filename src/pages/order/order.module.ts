import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { OrderPage } from "./order";
import { PipesModule } from "../../pipes/pipes.module";
import { MomentModule } from "angular2-moment";

@NgModule({
  declarations: [OrderPage],
  imports: [IonicPageModule.forChild(OrderPage), PipesModule, MomentModule]
})
export class OrderPageModule {}
