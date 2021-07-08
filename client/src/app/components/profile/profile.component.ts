import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExploreService } from 'src/app/services/explore.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public profileOwner:string = ""

  @ViewChild('imgUploadInput') imgUploadInput:any

  
  public profileFileToUpload:any

  
  public amIInThisBand:boolean = this._users.userInfo.bands.some(b=>b._id==this._explore.profile._id)

  constructor(
    public _users:UsersService,
    public _r:Router,
    public _ar:ActivatedRoute,
    public _explore:ExploreService
  ) { }

  ngOnInit(): void {

    console.log("profile init")
    console.log(this._ar.snapshot)
    this._ar.params.subscribe(parameter => {
    this.profileOwner = parameter.username
    this._explore.getProfile(this.profileOwner)
      
      // this._r.navigate(['first/4'])
      // this.parameterValue = parameter.parameter
    })

  }

  public profileImgUploadOpen():void{
    this.imgUploadInput.nativeElement.click()
  }

  public handleProfileFileInputChange(): void {
    this.profileFileToUpload = this.imgUploadInput.nativeElement.files[0]
    console.log(this.profileFileToUpload.name)
  }




}
