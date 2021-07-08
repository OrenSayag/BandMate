import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ExploreService } from 'src/app/services/explore.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css'],
})
export class LeftSidebarComponent implements OnInit {

  public panelOpenState:boolean = false

  constructor(
    public _users:UsersService,
    public _r:Router,
    public _explore:ExploreService,
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

  public panelToggler():void{
    this.panelOpenState = !this.panelOpenState
  }

  public logout():void{
    localStorage.removeItem("token")
    this._r.navigateByUrl('/login')
  }

}
