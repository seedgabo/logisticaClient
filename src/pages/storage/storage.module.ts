import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { StoragePage } from "./storage";
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [StoragePage],
  imports: [IonicPageModule.forChild(StoragePage), PipesModule]
})
export class StoragePageModule {}
