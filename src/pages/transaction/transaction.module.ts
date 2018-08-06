import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { TransactionPage } from "./transaction";
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [TransactionPage],
  imports: [IonicPageModule.forChild(TransactionPage), PipesModule]
})
export class TransactionPageModule {}
