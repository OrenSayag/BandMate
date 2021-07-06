import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements AfterViewInit {

  // @ViewChild('leftSideBar') leftSideBar:any

  public leftSidebarTog:boolean = false;
  // public ovh:boolean = false;

  public slideLeftSidebar(e:any):void{
    if(e==="open"){
      this.leftSidebarTog = true
      // console.log(this.leftSideBar.nativeElement)
      // console.log(this.leftSideBar.className)
      // this.leftSideBar.nativeElemenet.style.left = "0"
    }
    else if(e==="close"){
      console.log("running")
      this.leftSidebarTog = false

      // this.leftSideBar.nativeElemenet.style.left = "-87vw"
    }
  }
  
  constructor(
    public _users:UsersService
    ) { }
    
    ngAfterViewInit(): void {
      this._users.getUserInfo({})
    }
    
}
