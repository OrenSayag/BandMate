import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import PostModel from 'src/app/models/posts.model';
import { PostsService } from 'src/app/services/posts.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-post-unit',
  templateUrl: './post-unit.component.html',
  styleUrls: ['./post-unit.component.css'],
})
export class PostUnitComponent implements AfterViewInit {
  public commentsTog: boolean = false;

  @ViewChild('mediaCont') mediaCont: any;
  public audioUrl: string = '';
  public blob: Blob = new Blob();

  @Output()
  public killMe:EventEmitter<string> = new EventEmitter()

  @Input()
  public displayType:boolean=false
  
  @Input()
  public post: PostModel = {
    content: '',
    parentUser: {
      profile_img_src: '',
      _id: '',
      participants: [],
      username: '',
    },
    date: new Date(),
    isPrivate: false,
    _id: '',
    likes: [],
    comments: [],
    type: 'post',
    fileSrc: '',
    mediaType: 'no media',
  };
  
  //tools
  // public like:boolean = this.post.likes.includes(this._users.userInfo._id);

  constructor(
    public _users: UsersService,
    public _posts: PostsService,
    public _http: HttpClient
  ) {}

  ngAfterViewInit(): void {
    if (this.post.mediaType !== 'no media') {
      this.streamVideo(this.post.fileSrc);
      // console.log(this.post.fileSrc)
    } 
  }

  public canISeeAndRateIt(): boolean {
    // check if token holder is log owner or a participant
    const postParentUser: string = this.post.parentUser._id;
    const participantsOfPost: { userId: string }[] =
      this.post.parentUser.participants;
    const tokenHolder: string = this._users.userInfo._id;
    const isParticipant = participantsOfPost.some(
      (p) => p.userId === tokenHolder
    );
    // console.log(logParentUser)
    // console.log(participantsOfLog)
    // console.log(tokenHolder)
    // console.log(isParticipant)
    return tokenHolder === postParentUser || isParticipant;
  }
  public commentToggler(): void {
    this.commentsTog = !this.commentsTog;
  }

  public async addComment(id: string, text: string): Promise<string> {
    const newCommentId = await this._posts.postCommentPost(id, text);
    console.log(newCommentId)
    return newCommentId as string
    //  await this._users.updateContent()
  }

  public async delComment(postId: string, commentId: string): Promise<boolean> {
    const res = await this._posts.delCommentPost(postId, commentId);
    if (res) {
      return true;
    } else {
      return false;
    }
  }

  public async likePost(id:string):Promise<void>{
    const res = await this._posts.likePost(id)
    if(res){
      if(this.post.likes.includes(this._users.userInfo._id)){
        this.post.likes = this.post.likes.filter(u=>u!==this._users.userInfo._id)
      } 
      else {
        this.post.likes.push(this._users.userInfo._id)
      }
    }
  }

  // move to recording unit
  public async streamVideo(fileId: string) {
    this._http
      .get('http://localhost:666/api/bank/streamVideo/' + fileId, {
        headers: {
          authorization: localStorage.token,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
          'Access-Control-Allow-Headers':
            'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        responseType: 'arraybuffer',
      })
      .subscribe(
        (res) => {
          //  console.log(res);
          this.blob = new Blob([new Uint8Array(res)], {
            type: 'audio/mp3; codecs=opus',
          });
          this.audioUrl = window.URL.createObjectURL(this.blob);
          //  console.log(this.blob);
          //  console.log(this.audioUrl);

          //  this.testAudio.nativeElement.src = this.audioUrl;

          // **** Use this when printing logs (append children dynamicly after)

          if (this.post.mediaType == 'picture') {
            const picture = document.createElement('img');
            picture.className = "media"
            picture.src = this.audioUrl;
            picture.style.width = "80vw"
            this.mediaCont.nativeElement.appendChild(picture);
            console.log('displaying picture');
          } else {
            const audio = document.createElement('video');
            audio.setAttribute('controls', '');
            audio.style.width = "80vw"
            this.mediaCont.nativeElement.appendChild(audio);
            audio.src = this.audioUrl;

          }

        },
        (err) => {
          console.log(err);
        }
      );
  }
}
