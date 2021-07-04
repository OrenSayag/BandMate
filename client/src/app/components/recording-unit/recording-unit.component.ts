import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import Recording from 'src/app/models/recordings.model';
import { BankService } from 'src/app/services/bank.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-recording-unit',
  templateUrl: './recording-unit.component.html',
  styleUrls: ['./recording-unit.component.css']
})
export class RecordingUnitComponent implements AfterViewInit {
  
  // move to recording unit
  @ViewChild('mediaCont') mediaCont: any;
  // move to recording unit
    public audioUrl: string = '';
    public blob: Blob = new Blob();

  public commentsTog:boolean = false;


  @Input()
  public recording:Recording = {
    fileSrc: "",
    mediaType: "",
    ratingStars: 0,
    title: "",
    parentUser: {profile_img_src:"", _id:"", participants:[], username:""},
    date: new Date(),
    isPrivate: false,
    type: ""
  }

  constructor(
    public _http:HttpClient,
    public _sanitizer:DomSanitizer,
    public _users:UsersService,
    public _bank:BankService,

  ) { }

  ngAfterViewInit(): void {
    if(this.recording.mediaType=="audio"){
      this.streamAudio(this.recording.fileSrc)
    } else {
      this.streamVideo(this.recording.fileSrc)
    }
  }

  public canISeeAndRateIt():boolean{
    // check if token holder is log owner or a participant
  const recordingParentUser:string = this.recording.parentUser._id
  const participantsOfRecording:{userId:string}[] = this.recording.parentUser.participants
  const tokenHolder:string = this._users.userInfo._id
  const isParticipant = participantsOfRecording.some(p=>p.userId===tokenHolder)
  // console.log(logParentUser)
  // console.log(participantsOfLog)
  // console.log(tokenHolder)
  // console.log(isParticipant)
  return tokenHolder===recordingParentUser || isParticipant
}

public commentToggler():void {
  this.commentsTog = !this.commentsTog
}

// public async addComment(id:string, text:string):Promise<void>{
//   await this._logs.commentLog(id, text)
//   await this._users.updateContent()
// }


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
             console.log(res);
             this.blob = new Blob([new Uint8Array(res)], {
               type: 'audio/mp3; codecs=opus',
             });
             this.audioUrl = window.URL.createObjectURL(this.blob);
             console.log(this.blob);
             console.log(this.audioUrl);
   
            //  this.testAudio.nativeElement.src = this.audioUrl;
   
             // **** Use this when printing logs (append children dynamicly after)
             const clipContainer = document.createElement('article');
             const audio = document.createElement('video');
             audio.setAttribute('controls', '');
             clipContainer.appendChild(audio);
             this.mediaCont.nativeElement.appendChild(clipContainer);
             audio.src = this.audioUrl;
           },
           (err) => {
             console.log(err);
           }
         );
     }
   
     // move to recording unit
     public async streamAudio(fileId: string) {
       this._http
         .get('http://localhost:666/api/bank/streamAudio/' + fileId, {
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
             console.log(res);
             this.blob = new Blob([new Uint8Array(res)], {
               type: 'audio/mp3; codecs=opus',
             });
             this.audioUrl = window.URL.createObjectURL(this.blob);
            //  console.log(this.blob);
            //  console.log(this.audioUrl);
   
            //  this.testAudio.nativeElement.src = this.audioUrl;
   
             // **** Use this when printing logs (append children dynamicly after)
             const clipContainer = document.createElement('article');
             const audio = document.createElement('audio');
             audio.setAttribute('controls', '');
             clipContainer.appendChild(audio);
             this.mediaCont.nativeElement.appendChild(clipContainer);
             audio.src = this.audioUrl;
           },
           (err) => {
             console.log(err);
           }
         );
     }
   
     public getSantizeUrl(url: string) {
       return this._sanitizer.bypassSecurityTrustUrl(url);
     }

}
