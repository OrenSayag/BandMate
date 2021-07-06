import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-explore-genre-cell',
  templateUrl: './explore-genre-cell.component.html',
  styleUrls: ['./explore-genre-cell.component.css']
})
export class ExploreGenreCellComponent implements OnInit {

  @Input()
  public name:string = ""
  @Input()
  public imgSrc:string = ""

  constructor() { }

  ngOnInit(): void {
  }

}
