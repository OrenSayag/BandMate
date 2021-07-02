import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UsersService } from '../services/users.service';


@Injectable({
  providedIn: 'root'
})
export class TokenBodyGuardGuard implements CanActivate {

  constructor(
    
    public jwtHelper: JwtHelperService,
    public _users: UsersService,
    public _r: Router,
    
    ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(!localStorage.token){
      this._r.navigateByUrl('/login')
      return false
    }
    // console.log(this.jwtHelper.decodeToken(localStorage.token))
    
    if(this.jwtHelper.isTokenExpired(localStorage.token)){
      // console.log(this.jwtHelper.isTokenExpired(localStorage.token))
      this._r.navigateByUrl('/login')
      return false
    }
    this._users.userInfo = this.jwtHelper.decodeToken(localStorage.token).userInfo

    return true;
  }
  
}
