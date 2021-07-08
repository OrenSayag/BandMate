import { HttpClient, HttpClientJsonpModule } from '@angular/common/http';
import { LEADING_TRIVIA_CHARS } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import LogsModel from 'src/app/models/logs.model';
import PostModel from 'src/app/models/posts.model';
import Recording from 'src/app/models/recordings.model';
import { ExploreService } from 'src/app/services/explore.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {



  public contentFilter: string = 'all';

  public profileOwner: string = '';

  @ViewChild('imgUploadInput') profileImgUploadInput: any;
  @ViewChild('coverUploadInput') coverImgUploadInput: any;
  @ViewChild('profilePicRealCont') profilePicRealCont: any;
  @ViewChild('coverImgCont') coverImgCont: any;
  @ViewChild('top') top: any;

  public fileToUpload: any;

  public fileSrc: string = '';


  public amIInThisBand: boolean = false

  public profileImgUrl: string = '';
  public blob: Blob = new Blob();

  constructor(
    public _users: UsersService,
    public _r: Router,
    public _ar: ActivatedRoute,
    public _explore: ExploreService,
    public _http: HttpClient,
  ) {}


  async ngOnInit(): Promise<void> {
    
    await this._users.getTokenHolderInfo();
    this._ar.params.subscribe(async (parameter) => {
      this.profileOwner = parameter.username;
      await this._explore.getProfile(this.profileOwner);
      this.streamProfileImg(
        this._explore.profile.profile_img_src || '60e6b8c1056bb06118c223b2'
      );
      await this.streamCoverImg(
        this._explore.profile.cover_img_src || '60e6c300056bb06118c22c52'
      );
      await this._explore.getProfileContent(this.profileOwner)
      this.amIInThisBand = this._users.userInfo.bands.some(
        (b) => b._id == this._explore.profile._id
      );
    });
    console.log(this.profileOwner);
    
  }

  public profileImgUploadOpen(): void {
    this.profileImgUploadInput.nativeElement.click();
  }

  public coverImgUploadOpen(): void {
    this.coverImgUploadInput.nativeElement.click();
  }

  public async handleProfileFileInputChange(): Promise<void> {
    this.fileToUpload = this.profileImgUploadInput.nativeElement.files[0];
    console.log("changing profile")
    console.log(this.fileToUpload.name);
    await this.updateProfileImg('profile');
  }
  
  public async handleCoverFileInputChange(): Promise<void> {
    console.log("changing cover")
    this.fileToUpload = this.coverImgUploadInput.nativeElement.files[0];
    console.log(this.fileToUpload.name);
    await this.updateProfileImg('cover');
  }

  public async uploadProfileImg() {

    const file = new FormData();
    file.set('file', this.fileToUpload);
    const res: any = await this._http
      .post('http://localhost:666/api/bank/uploadFile', file, {
        headers: { authorization: localStorage.token },
      })
      .toPromise()
      .catch((err) => (this.fileSrc = ''));
    this.fileSrc = res.fileId;

    // console.log(this.fileSrc)
  }

  public async updateProfileImg(type: string) {
    if (this.profileImgUploadInput.nativeElement.files.length > 1) {
      // this.errorDivMessage = "Choose a single file"
      // setTimeout(() => {
      //   this.errorDivMessage = ""
      // }, 2000)
      return;
    }

    console.log(type)

    const fileType: string | undefined = this.fileToUpload.name
      .split('.')
      .pop();

    const allowedFileTypes = ['jpg', 'jpeg', 'png'];
    if (!allowedFileTypes.some((t) => t === fileType)) {
      // this.errorDivMessage = "Recieved wrong file type. Please upload mp4, jpg, jpeg, png"
      // setTimeout(() => {
      //   this.errorDivMessage = ""
      // }, 2000)
      console.log('Only jpg, jpeg, png are allowed');
      return;
    }

    await this.uploadProfileImg();
    // console.log(this.fileSrc)
    const body =
     ( type == 'profile'
        ? { profile_img_src: this.fileSrc }
        : { cover_img_src: this.fileSrc })
    const res: any = await this._http
      .post('http://localhost:666/api/user/updateProfileImg', body, {
        headers: {
          authorization: localStorage.token,
        },
      })
      .toPromise();
    if (res.ok) {
      console.log('successuly uploaded and updated profile img');
      if (type === 'profile') {
        this.streamProfileImg(this.fileSrc);
        this._users.userInfo.profile_img_src = this.fileSrc
      } else {
        this.streamCoverImg(this.fileSrc);
      }
    }
  }

  public async streamCoverImg(fileId: string) {
    // console.log(fileId)
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
          this.blob = new Blob([new Uint8Array(res)], {
            // type: 'audio/mp3; codecs=opus',
          });
          const url = window.URL.createObjectURL(this.blob);
          const picture = document.createElement('img');
          picture.src = url;
          picture.className = 'profile-img';
          picture.style.width = '100%';
          picture.style.height = '100%';
          // picture.style.zIndex="-50"
          // picture.style.borderRadius="50%"

          this.coverImgCont.nativeElement.removeChild(
            this.coverImgCont.nativeElement.lastChild
          );
          // this.coverImgCont.nativeElement.style.zIndex = "5"
          this.coverImgCont.nativeElement.appendChild(picture);
          // this.coverImgCont.nativeElement.style.backgroundImage = `url(${url})`
        },
        (err) => {
          console.log(err);
        }
      );
  }

  public async streamProfileImg(fileId: string) {
    // console.log(fileId)
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
          this.blob = new Blob([new Uint8Array(res)], {
            // type: 'audio/mp3; codecs=opus',
          });
          const url = window.URL.createObjectURL(this.blob);
          const picture = document.createElement('img');
          picture.src = url;
          picture.className = 'profile-img';
          picture.style.width = '50px';
          picture.style.height = '50px';
          picture.style.borderRadius = '50%';
          this.profilePicRealCont.nativeElement.removeChild(
            this.profilePicRealCont.nativeElement.lastChild
          );
          this.profilePicRealCont.nativeElement.appendChild(picture);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  public filterContent(filter:string):void{
    if(!['all', 'logs', 'recordings', 'posts'].includes(filter)){
      console.log("Wrong filter value")
    }
    this.contentFilter = filter
  }

  public async killContent(e:any):Promise<void>{
    const res = await this._explore.killContent(e)
    if(res){
      this._explore.profileContentMixed = this._explore.profileContentMixed.filter(c=>c._id!==e)
      this._explore.profileContentLogs = this._explore.profileContentLogs.filter(c=>c._id!==e)
      this._explore.profileContentRecordings = this._explore.profileContentRecordings.filter(c=>c._id!==e)
      this._explore.profileContentPosts = this._explore.profileContentPosts.filter(c=>c._id!==e)
    }
  }

}
