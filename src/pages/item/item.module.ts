import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ItemPage } from "./item";
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [ItemPage],
  imports: [IonicPageModule.forChild(ItemPage), PipesModule]
})
export class ItemPageModule {}
