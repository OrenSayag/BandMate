import { Component, OnInit } from '@angular/core';
import LogsModel from 'src/app/models/logs.model';
import { LogsService } from 'src/app/services/logs.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {

  public formTog:Boolean = false;

  constructor(
    public _users:UsersService,
    public _logs:LogsService,


  ) { }

  ngOnInit(): void {
    console.log(this._users.userInfo)
    // this._logs.getUserLogs()
  }

  public formToggler(){
    this.formTog = !this.formTog
  }

}
