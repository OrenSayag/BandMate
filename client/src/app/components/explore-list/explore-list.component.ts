import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BankService } from 'src/app/services/bank.service';
import { ExploreService } from 'src/app/services/explore.service';

@Component({
  selector: 'app-explore-list',
  templateUrl: './explore-list.component.html',
  styleUrls: ['./explore-list.component.css']
})
export class ExploreListComponent implements OnInit {

  public async killRecording(e:any){
    const res = await this._bank.delRecording(e)
    if(res){
      // this._bank.mainContent.logs = this._bank.mainContent.logs.filter(l=>l._id!=e)
      this._explore.exploreListContent = this._explore.exploreListContent.filter(p=>p._id!=e)
      // this._users.mainContent.logs = []
    }
  }

  constructor(
    public _explore:ExploreService,
    public _r:Router,
    public _bank:BankService,
  ) { }

  ngOnInit(): void {
    this._explore.getExploreListContent()
}

}
