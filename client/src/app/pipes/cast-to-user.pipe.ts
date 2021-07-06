import { Pipe, PipeTransform } from "@angular/core";
import UsersModel from "../models/users.model";

@Pipe({
    name: 'castUser',
    pure: true
  })
  export class CastToUsersPipe implements PipeTransform {  
    transform(value: any, args?: any): UsersModel {
      return value;
    }
  }