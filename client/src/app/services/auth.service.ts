import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LogsService } from './logs.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public _http:HttpClient,
    public _r:Router
    
    ) { }

  public async register(isBand:Boolean, fname:string, lname:string, userName:string,
     mail:string, password:string, instruments:string[], genres:string[], profile_img_src?:string){
       try {
         const res:any = await this._http.post("http://localhost:666/api/auth/register", {
        //  const res:any = await this._http.post("/api/auth/register", {
           isBand, fname, lname, userName, mail, password, instruments, genres, profile_img_src
         }, {
           headers: {"content-type":"application/json"}
         }).toPromise()
         if(res.ok==="new user created"){
          //  console.log(res)
           setTimeout(() => {
             this._r.navigateByUrl("/login")
           }, 2000)
           return res
         } 
       } catch (error) {
         console.log(error)
         return error
       }
  }

  public async login(mailOrUsername:string, password:string){
       try {
         const res:any = await this._http.post("http://localhost:666/api/auth/login", {
        //  const res:any = await this._http.post("/api/auth/login", {
           mailOrUsername, password
         }, {
           headers: {"content-type":"application/json"}
         }).toPromise()
         if(res.ok){
          //  console.log(res.ok)
           localStorage.token = res.ok
           setTimeout(() => {
             this._r.navigateByUrl("/logs")
           }, 2000)
           return res
         } 
       } catch (error) {

         console.log(error)
         return error.error
       }
  }
}
