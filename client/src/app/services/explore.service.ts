import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { UserInfo } from 'os';
import LogsModel from '../models/logs.model';
import PostModel from '../models/posts.model';
import Recording from '../models/recordings.model';
import UserInfoModel from '../models/tinyModels/userInfo.model';
import UsersModel from '../models/users.model';

@Injectable({
  providedIn: 'root'
})
export class ExploreService {

  public profile:UserInfoModel = {
    fname:"",
    lname:"",
    _id:"",
    bands:[],
    participants:[],
    instruments: [],
    isBand: false,
    username: "",
    profile_img_src: "",
    cover_img_src:"",
    bio:"",
    userFeed: [],
    following: [],
    followers: [],
  }

  public profileCountData:{
    logs:number,
    recordings:number,
    posts:number,
    followers:number,
    following:number,
  } = {
    logs:0,
    recordings:0,
    posts:0,
    followers:0,
    following:0,
  }

  public chosenGenre:{name:string, id:string}|string = {name:"",id:""}
  public allGenres:boolean = true

  public exploreListContent:(UsersModel|Recording)[] = []

  public searchResults:{
    logs:LogsModel[],
    recordings:Recording[],
    posts:PostModel[],
    users:UsersModel[],
    bands:UsersModel[],
  } = {
    logs:[],
    recordings:[],
    posts:[],
    users:[],
    bands:[],
  }

  
  public contentTypes:{name:string, img_src:string}[] = [
    {name:"bands", img_src:""},
    {name:"users", img_src:""},
    {name:"recordings", img_src:""},
]
  public chosenContentType:string = ""
  public allContentTypes:boolean = true

  constructor(
    public _http:HttpClient,
    public _ar:ActivatedRoute,


  ) { }

    public async getProfile(username:string):Promise<void>{
      const res:any = await this._http.get('http://localhost:666/api/user/info/'+username).toPromise()
      if(res.ok){
        this.profile = res.publicUserInfo
        this.profileCountData = res.profileCountData
        console.log(this.profile)
        console.log(this.profileCountData)
      }
    }



    public async searchExplore(value:string):Promise<void>{
      await this._http.get('http://localhost:666/api/explore/search/'+value)
        .subscribe(
          (response:any)=>{
            this.searchResults = response
            console.log(this.searchResults)
          },
          (err)=>{
            console.log(err)
          }
        )
    }

    public async getExploreListContent():Promise<void>{
      if(this.allContentTypes){
        this.chosenContentType = "all"
      }
      if(this.allGenres){
        this.chosenGenre = "all"
      }
      await this._http.post('http://localhost:666/api/explore/',
      {
        contentType:this.chosenContentType,
        genreId: this.chosenGenre
      }
      )
        .subscribe(
          (response:any)=>{
            if(response.ok){
              this.exploreListContent = response.content as (UsersModel|Recording)[]
              // console.log(this.searchResults)
            }
          },
          (err)=>{
            console.log(err)
          }
        )
    }


}
