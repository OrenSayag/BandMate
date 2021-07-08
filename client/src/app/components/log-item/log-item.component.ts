import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  public displayType:boolean = false;
  
  
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
  
  // public like:boolean = this.log.likes.includes(this._users.userInfo._id)

  @Output()
  public killMe:EventEmitter<string> = new EventEmitter()
  
  
  constructor(
    public _users:UsersService,
    public _logs:LogsService,
    
    
    ) { }
    
    ngOnInit(): void {
      
    }

    public async likeLog(id:string):Promise<void>{
      const res = await this._logs.likeLog(id)
      if(res){
        // this.like = !this.like
        if(this.log.likes.includes(this._users.userInfo._id)){
          this.log.likes = this.log.likes.filter(u=>u!==this._users.userInfo._id)
        } 
        else {
          this.log.likes.push(this._users.userInfo._id)
        }
      }
    }

    public async rateLog(id:string, stars:number):Promise<void>{
      const res = await this._logs.rateLog(id, stars).catch(err=>console.log(err))
      if(res){
        this.log.ratingStars = stars
      }
    }
    
    public canISeeAndRateIt():boolean{
      // check if token holder is log owner or a participant
    const logParentUser:string = this.log.parentUser._id
    const participantsOfLog:{userId:string}[] = this.log.parentUser.participants
    // console.log(participantsOfLog)
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
  
  public async addComment(id:string, text:string):Promise<string|boolean>{
    const res = await this._logs.commentLog(id, text)
    if(res){
        return res
    }
    return false
    // await this._users.updateContent()
  }

  public async delComment(logId:string ,commentId:string):Promise<boolean>{
      
    const res = await this._logs.delCommentFromLog(logId ,commentId);
    if(res){
      return true
    }
    else {
      return false
    }
}
}
