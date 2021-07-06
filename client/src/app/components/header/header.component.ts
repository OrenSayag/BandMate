import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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

  constructor(
    public _users:UsersService,
    public _r:Router,
  ) { }

  ngOnInit(): void {

  }

  public async avatarSwap(bandId?:string):Promise<void>{
    console.log(this._r.url)
    if(this._r.url==="/feed"){
      console.log("we're on feed")
      await this._users.getFeed()
    }
    else {
      console.log("we're on log/bank")
      await this._users.getUserInfo({bandId})
    }
  }

}
