import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

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

  public recordingState: boolean = false;
  public recorderTog: boolean = false;

  public recordingSrc:any = ""

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.recorder();
  }

  public openCloseRecorder(): void {
    this.recorderTog = !this.recorderTog;
    console.log(this.recorderTog);
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

          mediaRecorder.onstop =async  (e: any) => {
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
            this.soundClips.nativeElement.removeChild(this.soundClips.nativeElement.lastChild);
            this.soundClips.nativeElement.appendChild(clipContainer);

            const blob = new Blob(chunks, { type: 'audio/wav; codecs=opus' });
            // console.log(await blob.text())
            chunks = [];
            const audioURL = window.URL.createObjectURL(blob);
            audio.src = audioURL;
            this.recordingSrc = blob;
            console.log(this.recordingSrc)

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
            canvasCtx.fillStyle = 'linear-gradient(to right, #0f0c29, #302b63, #24243e);';
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
