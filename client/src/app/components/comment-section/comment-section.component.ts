import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import CommentsModel from 'src/app/models/comments.model';
import { LogsService } from 'src/app/services/logs.service';
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
  public comments:CommentsModel[] = []
  @Input()
  public contentId:string = ""




  constructor(
    public _logs:LogsService,
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
      const res = await this.commentFoo(this.contentId, this.myForm.controls.commentInput.value)
  }

  public async delComment(commentId:string):Promise<void>{
      const res = await this._logs.delCommentFromLog(this.contentId, commentId);
      if(res){
        this.comments = this.comments.filter(c=>c._id!=commentId)
      }
  }

}
