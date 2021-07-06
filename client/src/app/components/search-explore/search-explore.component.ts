import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExploreService } from 'src/app/services/explore.service';

@Component({
  selector: 'app-search-explore',
  templateUrl: './search-explore.component.html',
  styleUrls: ['./search-explore.component.css']
})
export class SearchExploreComponent implements OnInit {


  constructor(
    public _explore:ExploreService,
    public _r:Router,

  ) { }

  ngOnInit(): void {
    // console.log(this._explore.searchResults)
  }



  public handleSearch(event:any){
    console.log("running")
    this._explore.searchExplore(event.target.value)
  }

}
