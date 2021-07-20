import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('submit') submit:any

  public errorMessage:string = ""

  constructor(
    public _auth:AuthService,
    public _fb:FormBuilder,
    public _r:Router

  ) { }

  public async login(){
    const res = await this._auth.login(this.loginForm.controls.mailOrUsername.value,
      this.loginForm.controls.password.value)
    if(res.ok){
      this.errorMessage = "Succesfuly logged in! Enjoy BandMate"
    } else { 
      this.errorMessage = res.failAndDisplay
    }
  }

  public async loginGuest(){
    const res = await this._auth.login('guest',
      'Guest')
    if(res.ok){
      this.errorMessage = "Succesfuly logged in! Enjoy BandMate"
    } else { 
      this.errorMessage = res.failAndDisplay
    }
  }

  public loginForm = this._fb.group({
    mailOrUsername: ["", [Validators.required]],
    password: ["", [Validators.required]],
  })

  public submitForm(){
    this.submit.nativeElement.click()
  }



  ngOnInit(): void {

  }

}
