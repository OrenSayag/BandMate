import { prepareEventListenerParameters } from '@angular/compiler/src/render3/view/template';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import CommentsModel from 'src/app/models/comments.model';
import { BankService } from 'src/app/services/bank.service';
import { LogsService } from 'src/app/services/logs.service';
import { PostsService } from 'src/app/services/posts.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.css']
})
export class CommentSectionComponent implements OnInit {

  @Input()
  public commentFoo:Function = (id:string, text:string)=>{}
  @Input()
  public delCommentFoo:Function = (id:string)=>{}
  @Input()
  public comments:CommentsModel[] = []
  @Input()
  public contentId:string = ""
  @Input()
  public canIDeleteIt:boolean = false



  constructor(
    public _logs:LogsService,
    public _bank:BankService,
    public _posts:PostsService,
    public _users:UsersService,
    public _fb:FormBuilder,
  ) { }

  public myForm = this._fb.group({
    commentInput: ["", Validators.required]
  })

  ngOnInit(): void {
    console.log(this.comments)
  }

  public async postComment():Promise<void>{
    console.log("posting comment")
    const res = await this.commentFoo(this.contentId, this.myForm.controls.commentInput.value)
    console.log(res)
      if(res){
        console.log(res)
        this.comments.push({
          userId: {
            userId: this._users.userInfo._id,
            profile_img_src: this._users.userInfo.profile_img_src,
            username: this._users.userInfo.username
          },
          text: this.myForm.controls.commentInput.value,
          postedOn: new Date(),
          likes: [],
          _id: res
        })
        this.myForm.reset()
      }
  }

  public async delComment(commentId:string):Promise<void>{
      
      // const res = await this._logs.delCommentFromLog(this.contentId, commentId);
      const res = await this.delCommentFoo(this.contentId, commentId)
      if(res){
        this.comments = this.comments.filter(c=>c._id!=commentId)
      }
  }

//   public canISeeAndRateIt(comment:Comment):boolean{
//     if(comment===undefined){
//       return false
//     }

//     // check if token holder is log owner or a participant
//   const recordingParentUser:string = comment.userId.userId
//   const participantsOfRecording:{userId:string}[] = this.recording.parentUser.participants
//   const tokenHolder:string = this._users.userInfo._id
//   const isParticipant = participantsOfRecording.some(p=>p.userId===tokenHolder)
//   // console.log(logParentUser)
//   // console.log(participantsOfLog)
//   // console.log(tokenHolder)
//   // console.log(isParticipant)
//   return tokenHolder===recordingParentUser || isParticipant
// }



}
