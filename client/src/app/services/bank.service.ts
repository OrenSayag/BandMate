import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import CommentsModel from '../models/comments.model';
import Recording from '../models/recordings.model';
import ContentCategory from '../models/tinyModels/content-category.model';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class BankService {
  constructor(
    public _http: HttpClient,
    public _users: UsersService,
    ) {}

  public async postRecording(
    fileSrc: string,
    isPrivate: boolean,
    mediaType: string,
    bandId: string,
    instruments: string[],
    categories?: ContentCategory[],
    ratingStars?: number,
    title?: string,
    users?: string[],
  ): Promise<boolean> {
    const res: any = await this._http
      .post(
        'http://localhost:666/api/bank',
        {
          bandId,
          isPrivate,
          mediaType,
          fileSrc,
          ratingStars,
          title,
          users,
          instruments,
          categories
        },
        {
          headers: {
            'content-type': 'application/json',
            authorization: localStorage.token,
          },
        }
      )
      .toPromise();

    if (res.ok) {
      console.log('succesfully added recording');
      return true
    } else {
      console.log('failed to add recording');
      return false
    }
  }

  public async getSingleRecording(
    id:string
  ):Promise<Recording|boolean>{
    const res:any = await this._http.get('http://localhost:666/api/bank/'+id, {
      headers:{
        "content-type":"application/json",
        authorization:localStorage.token
      }
    }).toPromise().catch(err=>console.log(err))

    if(res.ok){
      console.log("succefuly fetched recording")
      return res.recording
    }
    console.log("coudln't fetch recording")
    return false
  }

  public async rateRecording(
    id:string,
    stars:number,
  ): Promise<boolean> {
    const res: any = await this._http
      .put(
        'http://localhost:666/api/bank/rate/'+id,
        {
          stars
        },
        {
          headers: {
            'content-type': 'application/json',
            authorization: localStorage.token,
          },
        }
      )
      .toPromise();

    if (res.ok) {
      console.log('succesfully rated recording');
      return true
    } else {
      console.log('failed to rate recording');
      return false
    }
  }

  public async likeRecording(id:string): Promise<boolean> {
    const res: any = await this._http
      .put(
        'http://localhost:666/api/bank/like/'+id,
        {
          
        },
        {
          headers: {
            'content-type': 'application/json',
            authorization: localStorage.token,
          },
        }
      )
      .toPromise();

    if (res.ok) {
      console.log('succesfully un/liked recording');
      return true
    } else {
      console.log('failed to un/like recording');
      return false
    }
  }

  public async postCommentRecording(id:string, text:string): Promise<CommentsModel|boolean> {
    const res: any = await this._http
      .post(
        'http://localhost:666/api/bank/comment/'+id,
        {
          text
        },
        {
          headers: {
            'content-type': 'application/json',
            authorization: localStorage.token,
          },
        }
      )
      .toPromise();

    if (res.ok) {
      console.log('succesfully commented recording');
      return res.id
    } else {
      console.log('failed to comment recording');
      return false
    }
  }

  public async delCommentRecording(recordingId:string,commentId:string): Promise<boolean> {
    const res: any = await this._http
      .delete(
        'http://localhost:666/api/bank/comment/'+recordingId+'/'+commentId,
        {
          headers: {
            'content-type': 'application/json',
            authorization: localStorage.token,
          },
        }
      )
      .toPromise();

    if (res.ok) {
      console.log('succesfully deleted comment from recording');
      return true
    } else {
      console.log('failed to delete comment recording');
      return false
    }
  }

  public async delRecording(recordingId:string): Promise<boolean> {
    const res: any = await this._http
      .delete(
        'http://localhost:666/api/bank/'+recordingId,
        {
          headers: {
            'content-type': 'application/json',
            authorization: localStorage.token,
          },
        }
      )
      .toPromise();

    if (res.ok) {
      console.log('succesfully deleted comment from recording');
      return true
    } else {
      console.log('failed to delete comment recording');
      return false
    }
  }
  
  public async addBankCategory(newCategory:{name:string,color:string}, bandId:string):Promise<boolean>{
    const res:any = await this._http.post("http://localhost:666/api/user/bankCategories"
    ,{newCategory, bandId},{
      headers: {
        authorization: localStorage.token
      }
    }).toPromise()

    if(res.ok){
      console.log("added a new bank category")
      // this._users.getUserInfo({bandId: this._users.currUserOtBand._id})
      return true
    }
      return false
  }

  public async delBankCategory(catName:string, bandId:string):Promise<boolean>{
    // console.log(bandId)
    const res:any = await this._http.post("http://localhost:666/api/user/bankCategories/"+catName
    ,{bandId},{
      headers: {
        authorization: localStorage.token,
        "content-type":"application/json"
      }
    }).toPromise()

    if(res.ok){
      console.log("removed this bank category")
      // this._users.getUserInfo({bandId: this._users.currUserOtBand._id})
      return true
    }
      return false
  }
}
