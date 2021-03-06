import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  templateUrl: 'popover.html',
})
export class PopoverPage {
  constructor(public viewCtrl: ViewController) {}

  close(action) {
    this.viewCtrl.dismiss({action: action});
  }
}
