import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BodegueroHomePage } from './bodeguero-home';

@NgModule({
  declarations: [
    BodegueroHomePage,
  ],
  imports: [
    IonicPageModule.forChild(BodegueroHomePage),
  ],
})
export class BodegueroHomePageModule {}
