import { Component, OnInit } from '@angular/core';
import { BankService } from 'src/app/services/bank.service';
import { ExploreService } from 'src/app/services/explore.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit {

  public formTog:Boolean = false;

  public async killRecording(e:any){
    const res = await this._bank.delRecording(e)
    if(res){
      this._users.mainContent.recordings = this._users.mainContent.recordings.filter(r=>r._id!=e)
      // this._explore.exploreListContent = this._explore.exploreListContent.filter(c=>c._id!=e)
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
    public _bank:BankService,
    public _explore:ExploreService,

  ) { }

  ngOnInit(): void {
  }

  public formToggler(){
    this.formTog = !this.formTog
  }

  

}
