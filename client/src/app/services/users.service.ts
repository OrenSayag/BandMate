import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import InstrumentsModel from '../models/instruments.model';
import MainContentModel from '../models/main-content.model';
import apiUserGetInfo from '../models/tinyModels/api-user-getiInfo.model';
import UserInfoModel from '../models/tinyModels/userInfo.model';
import LogsModel from '../models/logs.model';
import Recording from '../models/recordings.model';
import PostModel from '../models/posts.model';
import { ExploreService } from './explore.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  public mainContent: MainContentModel = {
    logs: [],
    recordings: [],
    posts: [],
  };

  public associatedUsers: {} = {};

  
  
  // public
  
  public userInfo: UserInfoModel = {
    bands: [],
    fname: '',
    lname: '',
    _id: '',
    instruments: [],
    participants: [],
    isBand: false,
    mail: '',
    username: '',
    profile_img_src: '',
    cover_img_src: '',
    bio: '',
    userFeed: [],
    following: [],
    followers: [],
    joinReqsWithUsers: [],
    genres: [],
  };

  public chosenAvatar:string = "";

  public currUserOtBand: {
    _id: string;
    username: string;
    // profile_img_src: string;
    // cover_img_src: string;
    instruments: InstrumentsModel[];
    logCategories:{name:string, color:string}[];
    bankCategories:{name:string, color:string}[];
  } = { _id: '', username: '', instruments: [], logCategories: [],bankCategories: [], };

  public userFeed:Array<LogsModel|Recording|PostModel> = []

  constructor(
    public _http: HttpClient,
    public _explore: ExploreService,
    public jwtHelper: JwtHelperService,

    ) {}

  public async getUserInfo(body: apiUserGetInfo) {
    const res: any = await this._http
      .post('http://localhost:666/api/user/personalInfo', body, {
        headers: {
          'content-type': 'application/json',
          authorization: localStorage.token,
        },
      })
      .toPromise();
    if (res.myContent) {
      this.mainContent = res.myContent;
      this.associatedUsers = res.associatedUsers;
      console.log(this.mainContent)
      // console.log(res.userOrHisBand)
      this.currUserOtBand = {
        _id: res.userOrHisBand._id,
        username: res.userOrHisBand.username,
        instruments: res.userOrHisBand.instruments,
        logCategories: res.userOrHisBand.logCategories,
        bankCategories: res.userOrHisBand.bankCategories,
      };
      // console.log(this.associatedUsers)
      // console.log(res)
    } else {
      console.log("wha the gell")
    }
  }

  public async getFeed() {
    const res: any = await this._http
      .post('http://localhost:666/api/user/feed', {
        bandId:this.currUserOtBand._id
      } ,{
        headers: {
          'content-type': 'application/json',
          authorization: localStorage.token,
        },
      })
      .toPromise();
    if (res.userFeed) {
      // console.log(res.userFeed)
      this.userInfo.userFeed = res.userFeed.sort((a:any,b:any)=>{return(<any>new Date(a.date)-<any>new Date(b.date))})
      console.log(this.userFeed)
    } else {
      console.log("wha the gell")
    }
  }

  public async updateContent() {
    await this.getUserInfo({bandId:this.currUserOtBand._id})
  }

  public async getTokenHolderInfo() {
    if(!localStorage.token){
      return
    }
    // console.log(this.jwtHelper.decodeToken(localStorage.token))
    
    if(this.jwtHelper.isTokenExpired(localStorage.token)){
      // console.log(this.jwtHelper.isTokenExpired(localStorage.token))
      return
    }
    const res: any = await this._http
      .get('http://localhost:666/api/user/tokenHolderInfo', {
        headers: {
          'content-type': 'application/json',
          authorization: localStorage.token,
        },
      })
      .toPromise();
    if (res.ok) {
      this.userInfo = res.ok;
      this.chosenAvatar = this.userInfo.profile_img_src
      // console.log(this.userInfo)
    }
  }

  public async followToggler(toFollowId:string):Promise<boolean>{
    const res:any = await this._http.put('http://localhost:666/api/user/follow/'+toFollowId,
    {},
    {
      headers: {
        authorization: localStorage.token
      }
    }
    ).toPromise()
    if(res.ok){
      // console.log(res.proof)
      if(this.userInfo.following.some(f=>f._id===toFollowId)){

        this.userInfo.following = this.userInfo.following.filter(f=>f._id!==toFollowId)
        // this._explore.profile.followers = this._explore.profile.followers
        // .filter(f=>f!==this.userInfo._id)
        this._explore.profileCountData.followers -= 1
      } else {
        
        this.userInfo.following.push(res.dataPack)
        this._explore.profileCountData.followers += 1
        // this._explore.profile.following
        // .push(this.userInfo._id)
      }
      
      return true
    }
    else {
      return false
    }
  }
}
