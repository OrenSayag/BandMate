import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import InstrumentsModel from '../models/instruments.model';
import apiUserGetInfo from '../models/tinyModels/api-user-getiInfo.model';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class InstrumentsService {
  public instrumentsCatalog: InstrumentsModel[] = [];
  public chosenInstruments: string[] = [];

  public currUserBandInstruments: InstrumentsModel[] = []

  constructor (
    public _http:HttpClient,
    public _users:UsersService,
  ) {}

  public async getInstruments() {
    const res: any = await this._http
      // .get('http://localhost:666/api/instruments', {
      .get('/api/instruments', {
        headers: { 'content-type': 'application/json' },
      })
      .toPromise();

    this.instrumentsCatalog = res.instruments;
  }

  public async getCurrUserBandInstruments(body:apiUserGetInfo) {
    const res: any = await this._http
      // .post('http://localhost:666/api/user/instruments', body ,{
      .post('/api/user/instruments', body ,{
        headers: { 'content-type': 'application/json', 
          authorization:localStorage.token
      },
      })
      .toPromise();

    this.currUserBandInstruments = res.ok;
  }

  public async addToUserInstruments(instrumentId:string, body:apiUserGetInfo):Promise<boolean> {
    const res: any = await this._http
      // .post('http://localhost:666/api/user/instruments/'+instrumentId, body ,{
      .post('/api/user/instruments/'+instrumentId, body ,{
        headers: { 'content-type': 'application/json', 
          authorization:localStorage.token
      },
      })
      .toPromise();

    if(res.ok){
      // console.log(res.ok)
      this._users.getUserInfo(body)

      return true
    }
    if(res.fail){
      // console.log(res.fail)
    }
    return false
  }

  public async deleteFromUserInstruments(instrumentId:string,body:apiUserGetInfo):Promise<boolean> {
    const res: any = await this._http
      // .post('http://localhost:666/api/user/instruments/delete/'+instrumentId, body ,{
      .post('/api/user/instruments/delete/'+instrumentId, body ,{
        headers: { 'content-type': 'application/json', 
          authorization:localStorage.token
      },
      })
      .toPromise();

    if(res.ok){
      // console.log(res.ok)
      this._users.getUserInfo(body)

      return true
    }
    if(res.fail){
      // console.log(res.fail)
    }
    return false
  }

}
