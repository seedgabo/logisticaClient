import { Injectable, Pipe } from '@angular/core';

/*
  Generated class for the FilterTicket pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
  name: 'filter'
})
@Injectable()
export class FilterTicket {
  /*
    Takes a value and makes it lowercase.
   */
  transform(value:Array<any>, args) {
    if(Array.isArray(value))
    return value.filter((item)=>{
        return item.titulo.toLowerCase().indexOf(args.toLowerCase()) != -1 || item.contenido.toLowerCase().indexOf(args.toLowerCase()) != -1;
    });
  }
}
