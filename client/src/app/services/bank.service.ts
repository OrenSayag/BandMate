import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import ContentCategory from '../models/tinyModels/content-category.model';

@Injectable({
  providedIn: 'root',
})
export class BankService {
  constructor(public _http: HttpClient) {}

  public async postRecording(
    fileSrc: string,
    isPrivate: boolean,
    mediaType: string,
    bandId: string,
    instruments: string[],
    categories?: ContentCategory[],
    ratingStars?: number,
    users?: string[],
    title?: string,
  ): Promise<void> {
    const res: any = await this._http
      .post(
        'http://localhost:666/bank',
        {
          bandId,
          isPrivate,
          mediaType,
          fileSrc,
          ratingStars,
          users,
          title,
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
    } else {
      console.log('failed to add recording');
    }
  }

  public async rateRecording(
    stars:number,
    id:string
  ): Promise<void> {
    const res: any = await this._http
      .put(
        'http://localhost:666/bank/rate/'+id,
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
        'http://localhost:666/bank/like/'+id,
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
        'http://localhost:666/bank/comment/'+id,
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
        'http://localhost:666/bank/comment/'+recordingId+'/'+commentId,
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
        'http://localhost:666/bank/'+recordingId,
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
}
