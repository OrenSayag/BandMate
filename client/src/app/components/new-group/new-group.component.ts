import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessagesService } from 'src/app/services/messages.service';
import { UsersService } from 'src/app/services/users.service';
import { MessagesMainComponent } from '../messages-main/messages-main.component';

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.component.html',
  styleUrls: ['./new-group.component.css']
})
export class NewGroupComponent implements OnInit {

  public groupName:string = ""

  public chosenMembers:string[] = []

  public errorDivMessage:string = ""

  constructor(
    public _location:Location,
    public _r:Router,
    public _messages:MessagesService,
    public _users:UsersService,
  ) { }

  ngOnInit(): void {
  }

  public togSelectMember(id:string):void{
    if(this.chosenMembers.includes(id)){
      this.chosenMembers = this.chosenMembers
      .filter(m=>m!==id)
      return
    }
    this.chosenMembers
    .push(id)
  }

  public async createGroup():Promise<void>{
    console.log("running")
    if(!this.groupName){
      this.errorDivMessage = "Missing Group's Name"
      return
    }

    const res:any = await this._messages.createGroup(
      this.chosenMembers,
      this.groupName
    )
    // console.log(res)
    if(res){
      this._r.navigateByUrl('/messages/conversation/'+res)
    }
  }

}
