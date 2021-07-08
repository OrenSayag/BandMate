import { Component } from '@angular/core';
import { LogsService } from './services/logs.service';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';

  constructor(public _users:UsersService) { }

  ngOnInit(): void {
    this._users.getTokenHolderInfo()

  }

  public handleClick(e:any):void{
    console.log(e)
  }
}
