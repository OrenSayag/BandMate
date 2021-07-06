import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import LogsModel from '../models/logs.model';
import PostModel from '../models/posts.model';
import Recording from '../models/recordings.model';
import UsersModel from '../models/users.model';

@Injectable({
  providedIn: 'root'
})
export class ExploreService {

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

  ) { }

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
