import { Pipe, PipeTransform } from "@angular/core";
import InstrumentsModel from "../models/instruments.model";


@Pipe({
    name: 'castInstrument',
    pure: true
  })
  export class CastToInstrumentPipe implements PipeTransform {  
    transform(value: any, args?: any): InstrumentsModel {
      return value;
    }
  }