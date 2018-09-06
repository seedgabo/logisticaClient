import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { OrderEditorPage } from "./order-editor";
import { PipesModule } from "../../pipes/pipes.module";
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [OrderEditorPage],
  imports: [IonicPageModule.forChild(OrderEditorPage), PipesModule, ComponentsModule]
})
export class OrderEditorPageModule {}
