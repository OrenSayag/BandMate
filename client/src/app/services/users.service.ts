import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import InstrumentsModel from '../models/instruments.model';
import MainContentModel from '../models/main-content.model';
import apiUserGetInfo from '../models/tinyModels/api-user-getiInfo.model';
import UserInfoModel from '../models/tinyModels/userInfo.model';

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
    logCategories:{name:"", color:""}[];
    bankCategories:{name:"", color:""}[];
  } = { _id: '', username: '', instruments: [], logCategories: [],bankCategories: [], };

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
