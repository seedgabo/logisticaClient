import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ItemChooserPage } from "./item-chooser";
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [ItemChooserPage],
  imports: [IonicPageModule.forChild(ItemChooserPage), PipesModule]
})
export class ItemChooserPageModule {}
