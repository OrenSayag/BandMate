import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExploreService } from 'src/app/services/explore.service';

@Component({
  selector: 'app-explore-pre-list',
  templateUrl: './explore-pre-list.component.html',
  styleUrls: ['./explore-pre-list.component.css']
})
export class ExplorePreListComponent implements OnInit {

  constructor(
    public _r:Router,
    public _explore:ExploreService,
  ) { }

  ngOnInit(): void {

  }

  public handleContentTypeClick(name:string,all?:boolean ):void{
    if(all){
      this._explore.allContentTypes = true
      this._r.navigateByUrl('/explore/list')
      return
    }
    this._explore.allContentTypes = false
    this._explore.chosenContentType = name
    this._r.navigateByUrl('/explore/list')

  }

}
