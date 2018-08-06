import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { TransformPage } from "./transform";
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [TransformPage],
  imports: [IonicPageModule.forChild(TransformPage), PipesModule]
})
export class TransformPageModule {}
