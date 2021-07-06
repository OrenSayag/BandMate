import { Pipe, PipeTransform } from "@angular/core";
import Recording from "../models/recordings.model";

@Pipe({
    name: 'castRecording',
    pure: true
  })
  export class CastToRecordingPipe implements PipeTransform {  
    transform(value: any, args?: any): Recording {
      return value;
    }
  }