import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css'],
})
export class LeftSidebarComponent implements OnInit {

  constructor(

  ) { }

  @Output()
  public slideLeftSidebar:EventEmitter<string> = new EventEmitter()


  ngOnInit(): void {
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // console.log(event)
      if(event.clientX>325){
        console.log("clicked outside")
        this.slideLeftSidebar.emit("close")
      }
  }

}
