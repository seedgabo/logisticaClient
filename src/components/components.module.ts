import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { IonicModule } from "ionic-angular";
import { PipesModule } from "../pipes/pipes.module";
import { SignatureComponent } from "./signature/signature";
@NgModule({
  declarations: [SignatureComponent],
  imports: [CommonModule, FormsModule, IonicModule, PipesModule],
  exports: [SignatureComponent]
})
export class ComponentsModule {}
