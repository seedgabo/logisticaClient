import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { OrderEditorBodegaPage } from "./order-editor-bodega";
import { MomentModule } from "angular2-moment";
import { PipesModule } from "../../pipes/pipes.module";
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [OrderEditorBodegaPage],
  imports: [IonicPageModule.forChild(OrderEditorBodegaPage), MomentModule, PipesModule, ComponentsModule]
})
export class OrderEditorBodegaPageModule {}
