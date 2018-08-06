import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { OrderCreatorPage } from "./order-creator";
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [OrderCreatorPage],
  imports: [IonicPageModule.forChild(OrderCreatorPage), PipesModule]
})
export class OrderCreatorPageModule {}
