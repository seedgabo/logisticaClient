import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ModalPicturesPage } from "./modal-pictures";
import { PipesModule } from "../../pipes/pipes.module";
import { LightboxModule } from 'ngx-lightbox';

@NgModule({
  declarations: [ModalPicturesPage],
  imports: [IonicPageModule.forChild(ModalPicturesPage), PipesModule, LightboxModule]
})
export class ModalPicturesPageModule {}
