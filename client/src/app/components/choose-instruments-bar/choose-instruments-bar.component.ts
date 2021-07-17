import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { MatDialog } from '@angular/material/dialog';
import { ChooseInstrumentsBarDialogComponent } from '../choose-instruments-bar-dialog/choose-instruments-bar-dialog.component';
import { InstrumentsService } from 'src/app/services/instruments.service';


@Component({
  selector: 'app-choose-instruments-bar',
  templateUrl: './choose-instruments-bar.component.html',
  styleUrls: ['./choose-instruments-bar.component.css']
})
export class ChooseInstrumentsBarComponent implements OnInit {

  public chosenInstruments:string[] = []

  @Output()
  public sendInstrumentArr:EventEmitter<string[]> = new EventEmitter()

  constructor(
    public _users:UsersService,
    public _dialog:MatDialog,
    public _instruments:InstrumentsService,

  ) { }

  openDialog(){
    this._dialog.open(ChooseInstrumentsBarDialogComponent)
  }

  ngOnInit(): void {

    this._instruments.getCurrUserBandInstruments({bandId:this._users.currUserOtBand._id})
    // console.log(this._instruments.currUserBandInstruments)
  }

  public handleClick(instrumentId:string):void{
    if(this.chosenInstruments.some(i=>i===instrumentId)){
      this.chosenInstruments = this.chosenInstruments.filter(i=>i!==instrumentId)
    } else {
      this.chosenInstruments.push(instrumentId)
    }
    this.sendInstrumentArr.emit(this.chosenInstruments)
    // console.log(this.chosenInstruments)
  }

  public determineChosen(instrumentId:string):boolean{
    if(this.chosenInstruments.some(i=>i===instrumentId)){
      return true
    } else {
      return false
    }
  }

}
