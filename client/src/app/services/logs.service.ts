import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import LogsModel from '../models/logs.model';
import ContentCategory from '../models/tinyModels/content-category.model';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class LogsService {
  constructor(public _http: HttpClient, public _users: UsersService) {}

  public async postLog(
    timeInMins: number,
    instruments: string[],
    isPrivate: boolean,
    bandId: string,
    title?: string,
    categories?: ContentCategory[],
    ratingStars?: number,
    users?: string[],
    date?: string[]
  ): Promise<boolean> {
    const res: any = await this._http
      .post(
        'http://localhost:666/api/logs/',
        // '/api/logs/',
        {
          timeInMins,
          instruments,
          isPrivate,
          bandId,
          title,
          categories,
          ratingStars,
        },
        {
          headers: {
            authorization: localStorage.token,
            'content-type': 'application/json',
          },
        }
      )
      .toPromise()
      .catch((err) => console.log(err));

    // console.log(logs)
    if (res.ok) {
      // console.log('posted log successfully');
      this._users.getUserInfo({ bandId: this._users.currUserOtBand._id });
      return true;
    }
    return false;
  }

  public async likeLog(id: string): Promise<boolean> {
    const res: any = await this._http
      .put(
        'http://localhost:666/api/logs/' + id,
        // '/api/logs/' + id,
        {},
        {
          headers: {
            authorization: localStorage.token,
            'content-type': 'application/json',
          },
        }
      )
      .toPromise();

    // console.log(logs)
    if (res.ok) {
      // console.log('un/liked log succesfuly');
      return true;
    } else {
      // console.log('failed to like/unlike log');
      return false;
    }
  }

  public async commentLog(id: string, text: string):Promise<boolean|string> {
    const res: any = await this._http
      .post(
        'http://localhost:666/api/logs/comment/' + id,
        // '/api/logs/comment/' + id,
        { text },
        {
          headers: {
            authorization: localStorage.token,
          },
        }
      )
      .toPromise();

    // console.log(logs)
    if (res.ok) {
      // console.log('commented log succesfuly');
      return res.id;
    } else {
      // console.log('failed to comment log');
      return false;
    }
  }

  public async delCommentFromLog(logId: string, commentId: string) {
    const res: any = await this._http
      .delete(
        'http://localhost:666/api/logs/comment/' + logId + '/' + commentId,
        // '/api/logs/comment/' + logId + '/' + commentId,
        {
          headers: {
            authorization: localStorage.token,
          },
        }
      )
      .toPromise()
      .catch((err) => console.log(err));

    // console.log(logs)
    if (res.ok) {
      // console.log('comment of log deleted succesfuly');
      return true;
    } else {
      // console.log('failed to deleted log comment');
      return false;
    }
  }

  public async rateLog(logId: string, newRating: number): Promise<boolean> {
    const res: any = await this._http
      .put(
        'http://localhost:666/api/logs/rate/' + logId,
        // '/api/logs/rate/' + logId,
        { newRating },
        {
          headers: {
            authorization: localStorage.token,
          },
        }
      )
      .toPromise();

    // console.log(logs)
    if (res.ok) {
      // console.log('rated log successfully');
      return true;
    } else {
      // console.log('failed to rate log');
      return false;
    }
  }

  public async deleteLog(logId: string): Promise<boolean> {
    const res: any = await this._http
      .delete('http://localhost:666/api/logs/' + logId, {
      // .delete('/api/logs/' + logId, {
        headers: {
          authorization: localStorage.token,
        },
      })
      .toPromise();

    // console.log(logs)
    if (res.ok) {
      // console.log('deleted log successfully');
      return true;
      // this._users.updateContent()
    } else {
      // console.log('failed to delete this log');
      return false;
    }
  }

  public async addLogCategory(
    newCategory: { name: string; color: string },
    bandId: string
  ): Promise<boolean> {
    const res: any = await this._http
      .post(
        'http://localhost:666/api/user/logCategories',
        // '/api/user/logCategories',
        { newCategory, bandId },
        {
          headers: {
            authorization: localStorage.token,
          },
        }
      )
      .toPromise();

    if (res.ok) {
      // console.log('added a new log category');
      // this._users.getUserInfo({bandId: this._users.currUserOtBand._id})
      return true;
    }
    // console.log('failed to add a category');
    return false;
  }

  public async delLogCategory(
    catName: string,
    bandId: string
  ): Promise<boolean> {
    // console.log(bandId)
    const res: any = await this._http
      .post(
        'http://localhost:666/api/user/logCategories/' + catName,
        // '/api/user/logCategories/' + catName,
        { bandId },
        {
          headers: {
            authorization: localStorage.token,
            'content-type': 'application/json',
          },
        }
      )
      .toPromise();

    if (res.ok) {
      // console.log('removed this log category');
      return true;
      // this._users.getUserInfo({bandId: this._users.currUserOtBand._id})
    }
    // console.log('failed to remove this log category');
    return true;
  }
}
