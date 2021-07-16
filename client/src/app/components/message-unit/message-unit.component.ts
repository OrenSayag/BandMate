import { Component, Input, OnInit } from '@angular/core';
import MessageUnitModel from 'src/app/models/message-unit.model';
import { MessagesService } from 'src/app/services/messages.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-message-unit',
  templateUrl: './message-unit.component.html',
  styleUrls: ['./message-unit.component.css']
})
export class MessageUnitComponent implements OnInit {

  @Input()
  public message:MessageUnitModel = {
    content: "",
    isJoinReq: false,
    from: {
      _id: "",
      username: "",
      profile_img_src: "",
    },
    to: {
      _id: "",
      username: "",
      profile_img_src: "",
    },
    status: "",
    date: new Date(),
    type:"",
    _id:"",
  }

  constructor(
    public _users:UsersService,
    public _messages:MessagesService,
  ) { }

  ngOnInit(): void {
  }


}
