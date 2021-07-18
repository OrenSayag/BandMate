import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import MessageUnitModel from 'src/app/models/message-unit.model';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-conversation-preview',
  templateUrl: './conversation-preview.component.html',
  styleUrls: ['./conversation-preview.component.css'],
})
export class ConversationPreviewComponent implements OnInit {
  @Input()
  public preview: MessageUnitModel = {
    content: '',
    isJoinReq: false,
    from: {
      username: '',
      _id: '',
      profile_img_src: ''
    },
    to: {
      username: '',
      _id: '',
      profile_img_src: ''
    },
    status: '',
    date: new Date(),
    type: '',
    _id: '',
  };

  constructor(
    public _users:UsersService,
    public _r:Router,
  ) {}

  ngOnInit(): void {}

  public determineStatusColor():string{
    if(!['approved','rejected','canceled'].includes(this.preview.status)){
      return ""
    }
    const status = this.preview.status
    if(status==='approved'){
      return "green"
    }
    if(status==='rejected' || status==='canceled'){
      return "red"
    }
    return ''
  }
}
