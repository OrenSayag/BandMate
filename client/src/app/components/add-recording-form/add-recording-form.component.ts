import { HttpClient } from '@angular/common/http';
import { AstMemoryEfficientTransformer } from '@angular/compiler';
import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import ContentCategory from 'src/app/models/tinyModels/content-category.model';
import { BankService } from 'src/app/services/bank.service';
import { UsersService } from 'src/app/services/users.service';


declare var MediaRecorder: any;

@Component({
  selector: 'app-add-recording-form',
  templateUrl: './add-recording-form.component.html',
  styleUrls: ['./add-recording-form.component.css'],
})
export class AddRecordingFormComponent implements AfterViewInit {
  @ViewChild('record') record: any;
  @ViewChild('stop') stop: any;
  @ViewChild('soundClips') soundClips: any;
  @ViewChild('audio') audio: any;
  @ViewChild('canvas') canvas: any;
  @ViewChild('fileInput') fileInput: any;

  // move to recording unit
  @ViewChild('testAudio') testAudio: any;

  public recordingState: boolean = false;
  public recorderTog: boolean = false;

  public recordingSrc: any = '';
  public fileToUpload:any = {};
  public ratingStars:number = 0;
  
  public fileId:string = "";

  public chosenInstruments:string[] = []
  public chosenCategories:ContentCategory[] = []

  public errorDivMessage:string = ""
  public successDivMessage:string = ""
  
  // move to recording unit
  public audioUrl: string = '';
  public blob: Blob = new Blob();

  @Output()
  public successfulpost:EventEmitter<boolean> = new EventEmitter()
  
  constructor(
    public _http: HttpClient,
    private _sanitizer: DomSanitizer,
    private _fb: FormBuilder,
    public _users: UsersService,
    public _bank: BankService,
    ) {}
    
    ngOnInit(): void {}
    
    ngAfterViewInit(): void {
      this.recorder();
    }
    
    public myForm = this._fb.group({
      isPrivate:[false],
      audioTrueVideoFalse:[true],
      title:[""],
    });

    public async postRecording():Promise<void>{


      
      
      let mediaType:string = ""
      if(this.myForm.controls.audioTrueVideoFalse.value){
        mediaType="audio"
        
      } else {
        mediaType="video"
      }
      //form validation
      if(this.chosenInstruments.length===0){
        this.errorDivMessage = "Please choose an instrument"
        setTimeout(() => {
          this.errorDivMessage = ""
        }, 2000)
        
        return
      }
      
      if(this.recordingSrc!=""){
        await this.uploadRecording()
      } else {
        console.log("uploading a file")
        await this.uploadFile()
      }

      if(!this.fileId){
        this.errorDivMessage = "Missing file to upload"
        setTimeout(() => {
          this.errorDivMessage = ""
        }, 2000)
        
        return
      }
      
      // console.log(this.chosenInstruments)
      
      const res = await this._bank.postRecording(
        this.fileId,
        this.myForm.controls.isPrivate.value,
        mediaType,
        this._users.currUserOtBand._id,
        this.chosenInstruments,
        this.chosenCategories,
        this.ratingStars,
        this.myForm.controls.title.value
      )
      if(res){

        this.successfulpost.emit(true)
        this.successDivMessage = "Posted to the bank!"
        setTimeout(() => {
          this.myForm.reset()
          this.chosenInstruments = []
          this.chosenCategories = []
          this.ratingStars = 0
          this.fileId = ''
          this.fileInput.nativeElement.value = ''
          const div = document.createElement('div');
          this.soundClips.nativeElement.removeChild(
            this.soundClips.nativeElement.lastChild
          );
          this.soundClips.nativeElement.appendChild(div);
        }, 2000)
      }
    }

    public addCategory(e:any){
      console.log(e.value)
      const colorArr = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
		  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
		  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
		  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
		  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
		  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
		  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
		  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
		  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
		  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

      this._bank.addBankCategory({name:e.value, color:colorArr[Math.floor(Math.random()*colorArr.length)]}, this._users.currUserOtBand._id)
      e.input.value = ""
    }

    public delCategory(catName:string){
    
      this._bank.delBankCategory(catName, this._users.currUserOtBand._id)
    }

    public handleClickCategory(category:ContentCategory):void{
      if(this.chosenCategories.some(c=>c===category)){
        this.chosenCategories = this.chosenCategories.filter(c=>c!==category)
      } else {
        this.chosenCategories.push(category)
      }
    }

    public chosenInstrumentsListener(e:string[]):void{
          this.chosenInstruments = e
          // console.log("from log form add:")
          // console.log(this.chosenInstruments)
        }

  public tempHandleChange(): void {
    // const file = this.fileInput.nativeElement.files[0]
    // console.log(file)

    this.recordingSrc = '';
    this.fileToUpload = this.fileInput.nativeElement.files[0]
    const div = document.createElement('div');
    this.soundClips.nativeElement.removeChild(
      this.soundClips.nativeElement.lastChild
    );
    this.soundClips.nativeElement.appendChild(div);
    console.log(this.fileToUpload)
  }

  public openCloseRecorder(close?:boolean): void {
    this.recorderTog = !this.recorderTog;
    console.log(this.recorderTog);
    if(close){
      this.recorderTog = false;
    }
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
        headers: { authorization: localStorage.token },
      })
      .toPromise()
      .catch(err=>this.fileId = "")
      // .subscribe((res: any) => {
        //   console.log(res);
        //   this.fileId = res.fileId;
        // })
          console.log(res);
          this.fileId = res.fileId;
     
  }

  public async uploadRecording() {
    const file = new FormData();
    file.set('file', this.recordingSrc);
    const res:any = await   this._http
      .post('http://localhost:666/api/bank/uploadFile', file, {
        headers: { authorization: localStorage.token },
      })
      .toPromise()
      .catch(err=>this.fileId="")

      // .subscribe((res: any) => {
      //   console.log(res);
      //   this.fileId = res.fileId;
      this.fileId = res.fileId;

  }

  // move to recording unit
  public async streamVideo(fileId: string) {
    this._http
      .get('http://localhost:666/api/bank/streamdVideo/' + fileId, {
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

          this.testAudio.nativeElement.src = this.audioUrl;

          // **** Use this when printing logs (append children dynamicly after)
          // const clipContainer = document.createElement('article');
          // const audio = document.createElement('audio');
          // audio.setAttribute('controls', '');
          // clipContainer.appendChild(audio);
          // this.soundClips.nativeElement.appendChild(clipContainer);
          // audio.src = this.audioUrl;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  // move to recording unit
  public async streamAudio(fileId: string) {
    this._http
      .get('http://localhost:666/api/bank/streamdAudio/' + fileId, {
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

          this.testAudio.nativeElement.src = this.audioUrl;

          // **** Use this when printing logs (append children dynamicly after)
          // const clipContainer = document.createElement('article');
          // const audio = document.createElement('audio');
          // audio.setAttribute('controls', '');
          // clipContainer.appendChild(audio);
          // this.soundClips.nativeElement.appendChild(clipContainer);
          // audio.src = this.audioUrl;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  public getSantizeUrl(url: string) {
    return this._sanitizer.bypassSecurityTrustUrl(url);
  }

  public handleRatingStar(star:number):void{
       this.ratingStars = star
     }

  public recorder() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log('getUserMedia supported.');
      navigator.mediaDevices
        .getUserMedia(
          // constraints - only audio needed for this app
          {
            audio: true,
          }
        )

        // Success callback
        .then((stream) => {
          const mediaRecorder = new MediaRecorder(stream);

          this.record.nativeElement.onclick = () => {
            if (mediaRecorder.state !== 'recording') {
              mediaRecorder.start();
              console.log(mediaRecorder.state);
              console.log('recorder started');

              this.recordingState = true;

              this.record.nativeElement.style.background = 'red';
              this.record.nativeElement.style.color = 'black';
            } else {
              mediaRecorder.stop();
              console.log(mediaRecorder.state);
              console.log('recorder stopped');

              this.recordingState = false;
              this.recorderTog = false;

              this.record.nativeElement.style.background = '';
              this.record.nativeElement.style.color = '';
            }
          };

          let chunks: any[] = [];

          mediaRecorder.ondataavailable = (e: any) => {
            chunks.push(e.data);
          };

          // this.stop.nativeElement.onclick = () => {
          //   mediaRecorder.stop();
          //   console.log(mediaRecorder.state);
          //   console.log("recorder stopped");
          //   this.record.nativeElement.style.background = "";
          //   this.record.nativeElement.style.color = "";
          // }

          mediaRecorder.onstop = async (e: any) => {
            console.log('recorder stopped');

            // const clipName = prompt('Enter a name for your sound clip');

            const clipContainer = document.createElement('article');
            const clipLabel: any = document.createElement('p');
            const audio = document.createElement('audio');
            // const deleteButton = document.createElement('button');

            clipContainer.classList.add('clip');
            audio.setAttribute('controls', '');
            // deleteButton.innerHTML = "Delete";

            clipContainer.appendChild(audio);
            clipContainer.appendChild(clipLabel);
            // clipContainer.appendChild(deleteButton);
            this.soundClips.nativeElement.removeChild(
              this.soundClips.nativeElement.lastChild
            );
            this.soundClips.nativeElement.appendChild(clipContainer);

            const blob = new Blob(chunks, { type: 'audio/mp3; codecs=opus' });
            // console.log(await blob.text())
            chunks = [];
            const audioURL = window.URL.createObjectURL(blob);
            audio.src = audioURL;
            this.recordingSrc = blob;
            console.log(this.recordingSrc);

            // if there's a recording, there's no chosen file
            this.fileInput.nativeElement.value = '';
            this.fileToUpload = ''

            // deleteButton.onclick = (e:any) => {
            //   let evtTgt = e.target;
            //   evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
            // }
          };

          const audioCtx = new window.AudioContext();
          const analyser = audioCtx.createAnalyser();
          console.log(analyser);
          const source = audioCtx.createMediaStreamSource(stream);
          source.connect(analyser);
          // analyser.connect(distortion);
          // distortion.connect(audioCtx.destination);

          analyser.fftSize = 2048;
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          analyser.getByteTimeDomainData(dataArray);

          const canvasCtx = this.canvas.nativeElement.getContext('2d');
          canvasCtx.clearRect(0, 0, 300, 150);

          const draw = () => {
            const drawVisual = requestAnimationFrame(draw);
            analyser.getByteTimeDomainData(dataArray);
            // canvasCtx.fillStyle = 'rgb(200, 200, 200)';
            canvasCtx.fillStyle =
              'linear-gradient(to right, #0f0c29, #302b63, #24243e);';
            canvasCtx.fillRect(0, 0, 300, 150);
            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = 'white';
            canvasCtx.beginPath();
            let sliceWidth = (300 * 1.0) / bufferLength;
            let x = 0;
            for (let i = 0; i < bufferLength; i++) {
              let v = dataArray[i] / 128.0;
              let y = (v * 150) / 2;

              if (i === 0) {
                canvasCtx.moveTo(x, y);
              } else {
                canvasCtx.lineTo(x, y);
              }

              x += sliceWidth;
            }
            canvasCtx.lineTo(
              this.canvas.nativeElement.width,
              this.canvas.nativeElement.height / 2
            );
            canvasCtx.stroke();
          };

          draw();

          // this.record.addEvent
        })

        // Error callback
        .catch(function (err) {
          console.log('The following getUserMedia error occurred: ' + err);
        });
    } else {
      console.log('getUserMedia not supported on your browser!');
    }
  }
}
