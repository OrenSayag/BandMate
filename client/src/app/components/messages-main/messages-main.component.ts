import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-messages-main',
  templateUrl: './messages-main.component.html',
  styleUrls: ['./messages-main.component.css']
})
export class MessagesMainComponent implements OnInit {

  @Output()
  slideMessagaesMain:EventEmitter<string> = new EventEmitter()

  constructor(
    public _r:Router,

  ) { }

  ngOnInit(): void {
    
  }

  

}
