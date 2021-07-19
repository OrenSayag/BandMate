import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PostsService } from 'src/app/services/posts.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-add-post-form',
  templateUrl: './add-post-form.component.html',
  styleUrls: ['./add-post-form.component.css']
})
export class AddPostFormComponent implements OnInit {

  @ViewChild('fileInput') fileInput:any

  @Output()
  public successfulPost:EventEmitter<boolean> = new EventEmitter()

  //tools
  public fileToUpload:any = ""

  public fileSrc:string = ""
  public errorDivMessage:string = ""
  public successDivMessage:string = ""

  constructor(
    private _fb:FormBuilder,
    private _posts:PostsService,
    private _users:UsersService,
    private _http:HttpClient,

  ) { }

  ngOnInit(): void {
  }

  public myForm = this._fb.group({
    content:[""],
    isPrivate:[false],
  });

  public clickFileInput(){
    this.fileInput.nativeElement.click()
  }

  

  public handleFileInputChange(): void {
    this.fileToUpload = this.fileInput.nativeElement.files[0]
    // console.log(this.fileToUpload.name)
  }

  public async uploadFile() {
    if (this.fileInput.nativeElement.files.length > 1) {
      this.errorDivMessage = "Choose a single file"
      setTimeout(() => {
        this.errorDivMessage = ""
      }, 2000)
      return
    }
    const mediaBlob = this.fileInput.nativeElement.files[0];
  
    const file = new FormData();
    file.set('file', mediaBlob);
    const res:any = await this._http
      .post('http://localhost:666/api/bank/uploadFile', file, {
      // .post('/api/bank/uploadFile', file, {
        headers: { authorization: localStorage.token },
      })
      .toPromise()
      .catch(err=>this.fileSrc = "")
      // .subscribe((res: any) => {
        //   console.log(res);
        //   this.fileId = res.fileId;
        // })
          // console.log(res);
          this.fileSrc = res.fileId;
  }

  public async postPost():Promise<void>{
    if (this.fileInput.nativeElement.files.length > 1) {
      this.errorDivMessage = "Choose a single file"
    setTimeout(() => {
        this.errorDivMessage = ""
      }, 2000)
      return
    }
    let mediaType:string
    if(this.fileToUpload){
      const fileType:string|undefined = this.fileToUpload.name.split('.').pop()
      const allowedFileTypes = ["jpg", "jpeg", "mp4", "png"]
      if(!allowedFileTypes.some(t=>t===fileType)){
        this.errorDivMessage = "Recieved wrong file type. Please upload mp4, jpg, jpeg, png"
        setTimeout(() => {
          this.errorDivMessage = ""
        }, 2000)
        return 
      }
      if(fileType==="mp4"){
        mediaType="video"
      }
      else{
        mediaType="picture"
      }
    } else {
      mediaType = "no media"
    }

    // console.log("[post form] mediaType: " + mediaType)

    //form validation
    if(!this.myForm.controls.content.value){
      this.errorDivMessage = "Missing content"
      return
    }

    await this.uploadFile()
    
    const res = await this._posts.postPost(
      this.myForm.controls.content.value,
      this.myForm.controls.isPrivate.value,
      this.fileSrc,
      this._users.currUserOtBand._id,
      mediaType,
    )
    if(res){
      this.successfulPost.emit(true)
      this.successDivMessage = "Successfully posted!"
      setTimeout(() => {
        this.myForm.reset({isPrivate:false, content:""})
        this.errorDivMessage = ""
        this.successDivMessage = ""
        this.fileSrc = ''
        this.fileInput.nativeElement.value = ''
        this._users.updateContent()
    }, 2000)
  }
  }
      


}
