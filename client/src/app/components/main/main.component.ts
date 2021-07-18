import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements AfterViewInit {

  @ViewChild('messagesMain') messagesMain:any

  public leftSidebarTog:boolean = true;
  public messagesMainTog:boolean = false;
  // public ovh:boolean = false;

  public slideLeftSidebar(e:any):void{
    if(e==="open"){
      this.leftSidebarTog = true
      // console.log(this.leftSideBar.nativeElement)
      // console.log(this.leftSideBar.className)
      // this.leftSideBar.nativeElemenet.style.left = "0"
    }
    else if(e==="close"){
      // console.log("running")
      this.leftSidebarTog = false

      // this.leftSideBar.nativeElemenet.style.left = "-87vw"
    }
  }

  public slideMessagesMain(e:any):void{
    if(e==="open"){
      // this.messagesMain.nativeElemenet.style.display = "flex"
      // console.log(this.messagesMain)
      
      this.messagesMainTog = true
      setTimeout(() => {
        this._r.navigateByUrl('/messages')
      }, 500)
      
      // console.log(this.leftSideBar.nativeElement)
      // console.log(this.leftSideBar.className)
      // this.leftSideBar.nativeElemenet.style.left = "0"
    }
    else if(e==="close"){
      // console.log("running")
      this.messagesMainTog = false

      // this.leftSideBar.nativeElemenet.style.left = "-87vw"
    }
  }
  
  constructor(
    public _users:UsersService,
    public _r:Router,
    ) { }
    
    ngAfterViewInit(): void {
      this._users.getUserInfo({})

      const url = this._r.url.split('/')[1]
      if(url==='messages'){
        this.messagesMainTog = true
      }

    }
    
}
