import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import InstrumentsModel from '../models/instruments.model';

@Injectable({
  providedIn: 'root',
})
export class InstrumentsService {
  public instrumentsCatalog: InstrumentsModel[] = [];
  public chosenInstruments: string[] = [];

  constructor (
    public _http:HttpClient
  ) {}

  public async getInstruments() {
    const res: any = await this._http
      .get('http://localhost:666/api/instruments', {
        headers: { 'content-type': 'application/json' },
      })
      .toPromise();

    this.instrumentsCatalog = res.instruments;
  }

}
