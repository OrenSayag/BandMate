import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minuteSeconds'
})
export class MinuteSecondsPipe implements PipeTransform {

  transform(minutes: number): string {
    let hours = Math.floor(minutes/60)
    let remainder = minutes%60
    if(hours<1){
        return remainder+"m"
    }
    if(remainder===0){
      return hours+"H"
    }
    return hours+"H, "+remainder+"m" 
  }
}