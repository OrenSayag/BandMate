import { Pipe, PipeTransform } from "@angular/core";
import PostModel from "../models/posts.model";

@Pipe({
    name: 'castPost',
    pure: true
  })
  export class CastToPostPipe implements PipeTransform {  
    transform(value: any, args?: any): PostModel {
      return value;
    }
  }