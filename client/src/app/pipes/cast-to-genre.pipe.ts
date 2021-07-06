import { Pipe, PipeTransform } from "@angular/core";
import GenresModel from "../models/genres.model";

@Pipe({
    name: 'castGenre',
    pure: true
  })
  export class CastToGenrePipe implements PipeTransform {  
    transform(value: any, args?: any): GenresModel {
      return value;
    }
  }