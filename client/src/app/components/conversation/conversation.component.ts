import { Location } from '@angular/common';
import { identifierModuleUrl } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {

  public content:string = ""

  constructor(
    public _messages:MessagesService,
    public _r:Router,
    public _ar:ActivatedRoute,
    public _location:Location,
  ) { }

  ngOnInit(): void {
    this._ar.params.subscribe(async (parameter) => {
      await this._messages.getConversation(parameter.id)
      
    });
  }

  public async sendMessage():Promise<void>{
    const res:boolean = await this._messages.sendMessage(
      this._messages.conversation._id,
      this.content,
      false,
    )
    if(res){
      this.content = ""
    }
  }

}
