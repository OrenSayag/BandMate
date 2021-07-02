import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import GenresModel from '../models/genres.model';
import InstrumentsModel from '../models/instruments.model';

@Injectable({
  providedIn: 'root'
})
export class GenresService {

  public genresCatalog:GenresModel[] = []
  // public instrumentsCatalog:InstrumentsModel[] = []

  public chosenGenres:string[] = []
  // public chosenInstruments:string[] = []



  constructor(
    public _http:HttpClient

  ) { }

  public async getGenres(){
    const res:any = await this._http.get("http://localhost:666/api/genres", {headers:
  {"content-type":"application/json"}}).toPromise()

  this.genresCatalog = res.genres
  }

  public addItem(item:string, array:string[]){
    array.push(item)
    console.log(array)
  }
}
