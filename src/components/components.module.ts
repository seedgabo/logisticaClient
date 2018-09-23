import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { IonicModule } from "ionic-angular";
import { PipesModule } from "../pipes/pipes.module";
import { SignatureComponent } from "./signature/signature";
import { ImageInputComponent } from "./image-input/image-input";
import { ItemSelectorComponent } from "./item-selector/item-selector";
@NgModule({
  declarations: [SignatureComponent, ImageInputComponent, ItemSelectorComponent],
  imports: [CommonModule, FormsModule, IonicModule, PipesModule],
  exports: [SignatureComponent, ImageInputComponent, ItemSelectorComponent]
})
export class ComponentsModule {}
