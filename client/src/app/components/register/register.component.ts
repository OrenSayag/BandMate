import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { GenresService } from 'src/app/services/genres.service';
import { InstrumentsService } from 'src/app/services/instruments.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public errorMessage:string = ""

  public chosenGenres:string[] = []
  public chosenInstruments:string[] = []
  

  constructor(
    private fb:FormBuilder,
    public _auth:AuthService,
    public _r:Router,
    public _genres:GenresService,
    public _instruments:InstrumentsService,
    ) { }

  ngOnInit(){
    this._genres.getGenres()
    this._instruments.getInstruments()
    console.log(this._genres.genresCatalog)
    console.log(this._instruments.instrumentsCatalog)
  }

  public async register() {
    const res = await this._auth.register(
      this.myForm.controls.isBand.value,
      this.myForm.controls.fname.value,
      this.myForm.controls.lname.value,
      this.myForm.controls.userName.value,
      this.myForm.controls.mail.value,
      this.myForm.controls.password.value,
      this.chosenInstruments,
      this.chosenGenres,
    )
    if(res){
      if(res.ok){
        this.errorMessage = "Succesfuly registered! Redirecting to login"


      } else {
        this.errorMessage = res.error.taken
      }
    }
  }
  
 public validatorDynamics(){
  this.myForm.get('isBand')?.valueChanges
  .subscribe(value => {
    console.log(value)
    if(!value) {
      this.myForm.get('fname')?.setValidators(Validators.required)
      this.myForm.get('lname')?.setValidators(Validators.required)
    } else {
      this.myForm.get('fname')?.clearValidators();
      this.myForm.get('lname')?.clearValidators();
    }
          this.myForm.controls['fname'].updateValueAndValidity();
    this.myForm.controls['lname'].updateValueAndValidity();
  }
);

 } 

  myForm = this.fb.group({
    isBand: [false],
    fname: ["", [Validators.required]],
    lname: ["", [Validators.required]],
    userName: ["", [Validators.required, 
      Validators.pattern(/^(?=[a-zA-Z0-9._]{4,10}$)(?!.*[_.]{2})[^_.].*[^_.]$/)]],
    mail: ["", [Validators.required, 
      Validators.pattern(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
    password: ["", [Validators.required, 
      Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)]],
  })

  public addItem(item:string, array:string[]){
    array.push(item)
    console.log(array)
  }


}
