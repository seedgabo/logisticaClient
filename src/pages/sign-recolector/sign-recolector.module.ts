import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { SignRecolectorPage } from "./sign-recolector";
import { PipesModule } from "../../pipes/pipes.module";
import { ComponentsModule } from "../../components/components.module";
import { MomentModule } from "angular2-moment";

@NgModule({
  declarations: [SignRecolectorPage],
  imports: [IonicPageModule.forChild(SignRecolectorPage), PipesModule, ComponentsModule, MomentModule]
})
export class SignRecolectorPageModule {}
