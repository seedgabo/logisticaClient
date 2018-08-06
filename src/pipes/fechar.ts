import { Injectable, Pipe } from '@angular/core';

declare var moment:any;
@Pipe({
  name: 'fechar'
})
@Injectable()
export class Fechar {
  transform(value, args) {
    value = value + "";
    if (args == undefined)
        return moment(value).format("dddd,D MMMM  YYYY, h:mm:ss a");
    else
        return moment(value).format(args);
  }
}
