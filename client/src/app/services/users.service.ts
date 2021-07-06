import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import InstrumentsModel from '../models/instruments.model';
import MainContentModel from '../models/main-content.model';
import apiUserGetInfo from '../models/tinyModels/api-user-getiInfo.model';
import UserInfoModel from '../models/tinyModels/userInfo.model';
import LogsModel from '../models/logs.model';
import Recording from '../models/recordings.model';
import PostModel from '../models/posts.model';

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
  };

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

  constructor(public _http: HttpClient) {}

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
      .post('http://localhost:666/api/user/feed', {} ,{
        headers: {
          'content-type': 'application/json',
          authorization: localStorage.token,
        },
      })
      .toPromise();
    if (res.userFeed) {
      this.userFeed = res.userFeed.sort((a:any,b:any)=>{return(<any>new Date(a.date)-<any>new Date(b.date))})
      // console.log(res.userFeed)
    } else {
      console.log("wha the gell")
    }
  }

  public async updateContent() {
    await this.getUserInfo({bandId:this.currUserOtBand._id})
  }

  public async getTokenHolderInfo() {
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
      // console.log(this.userInfo)
    }
  }
}
