import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import MainContentModel from '../models/main-content.model';
import apiUserGetInfo from '../models/tinyModels/api-user-getiInfo.model';
import UserInfoModel from '../models/tinyModels/userInfo.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  public mainContent:MainContentModel = {
    logs:[],
    recordings:[],
    posts:[],
  }

  public associatedUsers:{} = {

  }

  public userInfo:UserInfoModel = {
    bands: [],
    fname:"",
    lname:"",
    id:"",
    instruments:[],
    participants: [],
    isBand:false,
    mail:"",
    username:"",
    profile_img_src:"",
    cover_img_src:"",
    bio:"",
}
  
  constructor(

    public _http:HttpClient
  ) { }

  
  public async getUserInfo(body:apiUserGetInfo){
    const res:any = await this._http.post(
      "http://localhost:666/api/user/personalInfo",
      {body}, 
      {headers:
        {"content-type":"application/json",
        "authorization":localStorage.token
      }
      }).toPromise()
      if(res.myContent){
        this.mainContent = res.myContent
        this.associatedUsers = res.associatedUsers
        console.log(this.mainContent)
        console.log(this.associatedUsers)
      }
    
  }

}
