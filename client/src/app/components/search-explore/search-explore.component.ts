import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExploreService } from 'src/app/services/explore.service';

@Component({
  selector: 'app-search-explore',
  templateUrl: './search-explore.component.html',
  styleUrls: ['./search-explore.component.css']
})
export class SearchExploreComponent implements OnInit {

  public loading = false

  constructor(
    public _explore:ExploreService,
    public _r:Router,

  ) { }

  ngOnInit(): void {
    // console.log(this._explore.searchResults)
  }



  public async handleSearch(event:any){
    console.log("running")
    this.loading = true
    await new Promise((resolve, reject)=>{
      setTimeout(() => {
        resolve("")
      }, 400)
      
    })
    if(event.target.value===""){
      this._explore.searchResults = {
        logs: [],
        recordings:[],
        posts: [],
        users: [],
        bands: [],
      }
      this.loading = false
      return
    }
    this._explore.searchExplore(event.target.value)
    this.loading = false
  }

}
