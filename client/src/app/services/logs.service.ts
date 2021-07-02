import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import LogsModel from '../models/logs.model';

@Injectable({
  providedIn: 'root'
})
export class LogsService {


  constructor(public _http:HttpClient) { }

  

  // public async getUserLogs(){
  //   const logs:any = await this._http.get("http://localhost:666/api/logs", {
  //     headers: {
  //       authorization: localStorage.token
  //     }
  //   }).toPromise()


  //   // console.log(logs)
  //   if(!logs.error){
  //     this.userLogs = logs.userLogs
  //   }
  // }

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

}
