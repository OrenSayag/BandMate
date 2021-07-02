import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import LogsModel from '../models/logs.model';
import ContentCategory from '../models/tinyModels/content-category.model';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class LogsService {


  constructor(
    public _http:HttpClient,
    public _users:UsersService,
    ) { }


  
  public async postLog(timeInMins:number, instruments:string[], isPrivate:boolean, title?:string, categories?:ContentCategory[], ratingStars?:number,
    users?:string[], date?:string[]
    
    ):Promise<boolean>{
    const res:any = await this._http.post("http://localhost:666/api/logs/",
    {
      timeInMins,
      instruments,
      isPrivate,
      title,
      categories,
      ratingStars
    }
    ,{
      headers: {
        authorization: localStorage.token,
        "content-type":"application/json"
      }
    }).toPromise().catch(err=>console.log(err))


    // console.log(logs)
    if(res.ok){
      console.log("posted log successfully")
      this._users.getUserInfo({bandId:this._users.currUserOtBand._id})
      return true
    }
    return false
  }

  public async likeLog(id:string){
    const res:any = await this._http.put("http://localhost:666/api/logs/"+id, {
      headers: {
        authorization: localStorage.token
      }
    }).toPromise()


    // console.log(logs)
    if(res.ok){
      console.log("un/liked log succesfuly")
    }
  }

  public async commentLog(id:string, text:string){
    const res:any = await this._http.post("http://localhost:666/api/logs/comment/"+id, {text},{
      headers: {
        authorization: localStorage.token
      }
    }).toPromise()


    // console.log(logs)
    if(res.ok){
      console.log("commented log succesfuly")
    }
  }

  public async delCommentFromLog(logId:string, commentId:string){
    const res:any = await this._http.delete("http://localhost:666/api/logs/comment/"+logId + "/" + commentId, {
      headers: {
        authorization: localStorage.token
      }
    }).toPromise()


    // console.log(logs)
    if(res.ok){
      console.log("comment of log deleted succesfuly")
    }
  }

  public async rateLog(logId:string, newRating:number){
    const res:any = await this._http.put("http://localhost:666/api/logs/rate/"+logId,
    {newRating}
    ,{
      headers: {
        authorization: localStorage.token
      }
    }).toPromise()


    // console.log(logs)
    if(res.ok){
      console.log("rated log successfully")
    }
  }

  public async deleteLog(logId:string){
    const res:any = await this._http.delete("http://localhost:666/api/logs/"+logId
    ,{
      headers: {
        authorization: localStorage.token
      }
    }).toPromise()


    // console.log(logs)
    if(res.ok){
      console.log("deleted log successfully")
    }
  }

  public async addLogCategory(newCategory:{name:string,color:string}, bandId:string){
    const res:any = await this._http.post("http://localhost:666/api/user/logCategories"
    ,{newCategory, bandId},{
      headers: {
        authorization: localStorage.token
      }
    }).toPromise()

    if(res.ok){
      console.log("added a new log category")
      this._users.getUserInfo({bandId: this._users.currUserOtBand._id})
    }
    if(res.fail){
      console.log(res.fail)
    }
  }

  public async delLogCategory(catName:string, bandId:string){
    // console.log(bandId)
    const res:any = await this._http.post("http://localhost:666/api/user/logCategories/"+catName
    ,{bandId},{
      headers: {
        authorization: localStorage.token,
        "content-type":"application/json"
      }
    }).toPromise()

    if(res.ok){
      console.log("removed this log category")
      this._users.getUserInfo({bandId: this._users.currUserOtBand._id})
    }
    if(res.fail){
      console.log(res.fail)
    }
  }

}
