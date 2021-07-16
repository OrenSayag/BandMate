import { Location } from '@angular/common';
import { CONTEXT_NAME } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
// const metronomeApp = require("./app")

@Component({
  selector: 'app-metronome',
  templateUrl: './metronome.component.html',
  styleUrls: ['./metronome.component.css'],
})
export class MetronomeComponent implements OnInit {
  constructor(public _location: Location) {}

  ngOnInit(): void {
    // this.osc.connect(this.audioContext.destination);
    // this.metronome()
  }

  public audioContext: AudioContext = new AudioContext();
  // public osc = this.audioContext.createOscillator()

  public bpm: number = 100;
  public metronomeOn: boolean = false;
  public currBeat = 0;

  public async tog() {
    this.metronomeOn = !this.metronomeOn;
    if (this.metronomeOn) {
        this.audioContext = new AudioContext();
      const osc = this.audioContext.createOscillator();
      osc.frequency.value = 1000;
      osc.connect(this.audioContext.destination);

      osc.start();
      osc.stop(0.03);
      this.currentQuarterNote = 0;
      this.scheduler();
    } else {
      await this.audioContext.close();
      console.log(this.nextNoteTime);
      console.log(this.audioContext.currentTime);
      console.log(this.scheduleAheadTime);
      this.nextNoteTime = 0;
    }
  }

  public metronome() {
    // play every 60/bpm, and assign next play if metoroneOn
    // const currBeatOsc = this.audioContext.createOscillator()
    // if(this.currBeat===0){
    //     currBeatOsc.frequency.value = 800
    // } else {
    //     currBeatOsc.frequency.value = 400
    // }
    // currBeatOsc.connect(this.audioContext.destination);
    // currBeatOsc.start(this.audioContext.currentTime+60/this.bpm)
    // currBeatOsc.stop(this.audioContext.currentTime+60/this.bpm+.01)
    // this.currBeat++
    // if(this.currBeat===4){
    //     this.currBeat = 0
    // }
    // currBeatOsc.onended = ()=>{
    //     if(this.metronomeOn){
    //         this.metronome()
    //     }
    // }
  }

  scheduleNote(beatNumber: number, time: number) {
    // create an oscillator
    const osc = this.audioContext.createOscillator();
    const envelope = this.audioContext.createGain();

    osc.frequency.value = beatNumber % 4 == 0 ? 1000 : 800;
    envelope.gain.value = 1;
    envelope.gain.exponentialRampToValueAtTime(1, time + 0.001);
    envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

    osc.connect(envelope);
    envelope.connect(this.audioContext.destination);

    osc.start(time);
    osc.stop(time + 0.03);
  }

  public nextNoteTime: number = 0;
  public scheduleAheadTime: number = 300;
  public currentQuarterNote: number = 0;
  public tempo: number = 100;

  scheduler() {
    console.log('scheduler running');
    // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
    console.log(this.nextNoteTime);
    console.log(this.audioContext.currentTime);
    console.log(this.scheduleAheadTime);
    while (
      this.nextNoteTime <
      this.audioContext.currentTime + this.scheduleAheadTime
    ) {
      this.scheduleNote(this.currentQuarterNote, this.nextNoteTime);
      console.log('while is happening');

      // Advance current note and time by a quarter note (crotchet if you're posh)
      this.nextNoteTime += 60.0 / this.tempo; // Add beat length to last beat time

      this.currentQuarterNote++; // Advance the beat number, wrap to zero
      if (this.currentQuarterNote == 4) {
        this.currentQuarterNote = 0;
      }
    }
  }
}
