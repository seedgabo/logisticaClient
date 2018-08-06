import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { InvoicesPage } from "./invoices";
import { PipesModule } from "../../pipes/pipes.module";
import { MomentModule } from "angular2-moment";

@NgModule({
  declarations: [InvoicesPage],
  imports: [IonicPageModule.forChild(InvoicesPage), PipesModule, MomentModule]
})
export class InvoicesPageModule {}
