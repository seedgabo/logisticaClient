import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { OrderCreatorPage } from "./order-creator";
import { PipesModule } from "../../pipes/pipes.module";
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [OrderCreatorPage],
  imports: [IonicPageModule.forChild(OrderCreatorPage), PipesModule, ComponentsModule]
})
export class OrderCreatorPageModule {}
