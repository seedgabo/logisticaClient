import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { AnnotationsPage } from "./annotations";
import { PipesModule } from "../../pipes/pipes.module";
import { MomentModule } from "angular2-moment";

@NgModule({
  declarations: [AnnotationsPage],
  imports: [IonicPageModule.forChild(AnnotationsPage), PipesModule, MomentModule]
})
export class AnnotationsPageModule {}
