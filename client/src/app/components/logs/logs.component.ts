
import { Component, Input, OnInit } from '@angular/core';
import LogsModel from 'src/app/models/logs.model';
import { ExploreService } from 'src/app/services/explore.service';
import { LogsService } from 'src/app/services/logs.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {

  public formTog:Boolean = false;

  public loading:boolean = true

  public async killLog(e:any){
    const res = await this._logs.deleteLog(e)
    if(res){
      this._users.mainContent.logs = this._users.mainContent.logs.filter(l=>l._id!=e)
      // this._explore.exploreListContent = this._explore.exploreListContent.filter(p=>p._id!=e)
      // this._users.mainContent.logs = []
    }
  }
  

  public formListener(e:boolean):void{
    if(e){
      setTimeout(() => {
        this.formTog = false
      }, 2000)
      
    }
  }

  constructor(
    public _users:UsersService,
    public _logs:LogsService,
    public _explore:ExploreService,


  ) { }

  async ngOnInit(): Promise<void> {
    // console.log(this._users.userInfo)
    // this._logs.getUserLogs()
    await new Promise((resolve, reject)=>{
      setTimeout(() => {
        resolve("")
      }, 500)
      
    })
    this.loading = false;
  }

  public formToggler(){
    this.formTog = !this.formTog
  }

}
