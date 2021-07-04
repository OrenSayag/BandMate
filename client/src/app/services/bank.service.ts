import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  public async rateRecording(
    stars:number,
    id:string
  ): Promise<void> {
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
    } else {
      console.log('failed to rate recording');
    }
  }

  public async likeRecording(id:string): Promise<void> {
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
    } else {
      console.log('failed to un/like recording');
    }
  }

  public async postCommentRecording(id:string, text:string): Promise<void> {
    const res: any = await this._http
      .put(
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
    } else {
      console.log('failed to comment recording');
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
  
  public async addBankCategory(newCategory:{name:string,color:string}, bandId:string){
    const res:any = await this._http.post("http://localhost:666/api/user/bankCategories"
    ,{newCategory, bandId},{
      headers: {
        authorization: localStorage.token
      }
    }).toPromise()

    if(res.ok){
      console.log("added a new bank category")
      this._users.getUserInfo({bandId: this._users.currUserOtBand._id})
    }
    if(res.fail){
      console.log(res.fail)
    }
  }

  public async delBankCategory(catName:string, bandId:string){
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
      this._users.getUserInfo({bandId: this._users.currUserOtBand._id})
    }
    if(res.fail){
      console.log(res.fail)
    }
  }
}
