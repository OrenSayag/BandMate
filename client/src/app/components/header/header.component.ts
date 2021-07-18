import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output()
  public slideLeftSidebar:EventEmitter<string> = new EventEmitter()
  @Output()
  public slideMessagaesMain:EventEmitter<string> = new EventEmitter()


  constructor(
    public _users:UsersService,
    public _r:Router,
    public _ar:ActivatedRoute,
  ) { }

  ngOnInit(): void {

  }


  public async avatarSwap(bandId?:string, username?:string, imgSrc?:string):Promise<void>{
    console.log(this._r.url)
    if(imgSrc){this._users.chosenAvatar = imgSrc}
    // this.chosenAvatar = username || 'me'
    if(this._r.url==="/feed"){
      // console.log("we're on feed")
      await this._users.getFeed()
    } 
    else if (this._r.url.split("/")[1] === "explore"){
      this._r.navigateByUrl("/explore/profile/"+username)
    }
    else {
      // console.log("we're on log/bank")
      await this._users.getUserInfo({bandId})
    }

    // console.log(this._r.url.split("/")[1])
  }

}
