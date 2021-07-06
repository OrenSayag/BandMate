import { Pipe, PipeTransform } from "@angular/core";
import LogsModel from "../models/logs.model";

@Pipe({
    name: 'castLog',
    pure: true
  })
  export class CastToLogPipe implements PipeTransform {  
    transform(value: any, args?: any): LogsModel {
      return value;
    }
  }