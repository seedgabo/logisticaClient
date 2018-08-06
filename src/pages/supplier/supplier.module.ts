import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { SupplierPage } from "./supplier";
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [SupplierPage],
  imports: [IonicPageModule.forChild(SupplierPage), PipesModule]
})
export class SupplierPageModule {}
