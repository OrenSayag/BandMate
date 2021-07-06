import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-explore-content-type-cell',
  templateUrl: './explore-content-type-cell.component.html',
  styleUrls: ['./explore-content-type-cell.component.css']
})
export class ExploreContentTypeCellComponent implements OnInit {

  @Input()
  public name: string = ""
  @Input()
  public imgSrc: string = ""

  constructor() { }

  ngOnInit(): void {
  }

}
