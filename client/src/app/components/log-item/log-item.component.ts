import { Component, Input, OnInit } from '@angular/core';
import CommentsModel from 'src/app/models/comments.model';
import LogsModel from 'src/app/models/logs.model';
import { LogsService } from 'src/app/services/logs.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-log-item',
  templateUrl: './log-item.component.html',
  styleUrls: ['./log-item.component.css']
})
export class LogItemComponent implements OnInit {


  public commentsTog:boolean = false;

  
  @Input()
  public log:LogsModel = {
    timeInMins: 0,
    title: "",
    parentUser: {profile_img_src:"", _id:"", participants:[], username:"",},
    date: new Date(),
    ratingStars: 0,
    isPrivate: false,
    _id:"",
    likes:[],
    comments:[],
  }

  
  
  constructor(
    public _users:UsersService,
    public _logs:LogsService,
    
    
    ) { }
    
    ngOnInit(): void {

    }
    
    public canISeeAndRateIt():boolean{
      // check if token holder is log owner or a participant
    const logParentUser:string = this.log.parentUser._id
    const participantsOfLog:{userId:string}[] = this.log.parentUser.participants
    const tokenHolder:string = this._users.userInfo._id
    const isParticipant = participantsOfLog.some(p=>p.userId===tokenHolder)
    // console.log(logParentUser)
    // console.log(participantsOfLog)
    // console.log(tokenHolder)
    // console.log(isParticipant)
    return tokenHolder===logParentUser || isParticipant
  }
  
  public commentToggler():void {
    this.commentsTog = !this.commentsTog
  }
  
  public async addComment(id:string, text:string):Promise<void>{
    await this._logs.commentLog(id, text)
    await this._users.updateContent()
  }
}
