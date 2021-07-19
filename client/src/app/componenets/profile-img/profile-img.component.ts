import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-profile-img',
  templateUrl: './profile-img.component.html',
  styleUrls: ['./profile-img.component.css']
})
export class ProfileImgComponent implements OnInit {

  @ViewChild('cont') cont:any

  @Input()
  public src:string = ""

  @Input()
  public size:string = ""

  @Input()
  public ofHeader:boolean = false

  @Input()
  public timeout:boolean = false


  public blob:any

  public loading:boolean = true

  constructor(
    public _http:HttpClient,
    public _users:UsersService,
  ) { }

  async ngOnInit() {
    // await this._users.getTokenHolderInfo()
    if(this.timeout){
      await new Promise((resolve, reject)=>{
        setTimeout(() => {
          resolve("")
        }, 400)
        
      })
    }
    await this.streamProfileImg(this.src || '60e6b8c1056bb06118c223b2')
    this.loading=false
  }

  public async streamProfileImg(fileId: string) {
    // console.log(fileId)
    this._http
      .get('http://localhost:666/api/bank/streamVideo/' + fileId, {
      // .get('/api/bank/streamVideo/' + fileId, {
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
          picture.style.width = this.size ||'50px';
          picture.style.height = this.size ||'50px';
          picture.style.borderRadius = '50%';
          picture.style.objectFit = 'cover';

          this.cont.nativeElement.removeChild(
            this.cont.nativeElement.lastChild
          );
          this.cont.nativeElement.appendChild(picture);
          // console.log(this.cont.nativeElement)
        },
        (err) => {
          console.log(err);
        }
      );
  }


}
