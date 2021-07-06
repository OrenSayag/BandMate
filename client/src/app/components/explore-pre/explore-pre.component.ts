import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExploreService } from 'src/app/services/explore.service';
import { GenresService } from 'src/app/services/genres.service';

@Component({
  selector: 'app-explore-pre',
  templateUrl: './explore-pre.component.html',
  styleUrls: ['./explore-pre.component.css']
})
export class ExplorePreComponent implements OnInit {

  constructor(
    public _r:Router,
    public _genres:GenresService,
    public _explore:ExploreService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this._genres.getGenres()
  }

  public handleFocus():void{
    this._r.navigateByUrl("/explore/search")
  }

  public handleGenreClick(id:string, name:string,all?:boolean ):void{
    if(all){
      this._explore.allGenres = true
      this._r.navigateByUrl('/explore/preList')
      return
    }
    this._explore.allGenres = false
    this._explore.chosenGenre = id
    this._r.navigateByUrl('/explore/preList')

  }

}
