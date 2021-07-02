import { BooleanInput } from '@angular/cdk/coercion';
import { Component, OnInit } from '@angular/core';
import { Event } from '@angular/router';
import InstrumentsModel from 'src/app/models/instruments.model';
import { InstrumentsService } from 'src/app/services/instruments.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-choose-instruments-bar-dialog',
  templateUrl: './choose-instruments-bar-dialog.component.html',
  styleUrls: ['./choose-instruments-bar-dialog.component.css']
})
export class ChooseInstrumentsBarDialogComponent implements OnInit {

  public errorDivMessage:string = ""

  constructor(
    public _instruments:InstrumentsService,
    public _users:UsersService,
  ) { }

  ngOnInit(): void {
    this._instruments.getInstruments()
    // console.log(this._instruments.instrumentsCatalog)
    console.log(this._users.currUserOtBand)
  }

  public areYouMyInstrument(instrumentId:string):boolean{
    const myInstruments = this._users.currUserOtBand.instruments
    // console.log(myInstruments)
    return myInstruments.some(i=>i._id==instrumentId)
  }

  public async addOrRemoveInstrumentOfUserBand(event:any, instrumentId:string){
    // console.log(event)
    if(event.checked){
      // console.log("handle add")
      const res = await this._instruments.addToUserInstruments(instrumentId, {bandId:this._users.currUserOtBand._id})
      if(res){
        event.source._checked=true
      } else {
        event.source._checked=false
      }
      
    } else {
      // console.log("handle delete")
      const res = await this._instruments.deleteFromUserInstruments(instrumentId, {bandId:this._users.currUserOtBand._id})
      .catch(()=>{
        event.source._checked=true;
        this.errorDivMessage = "You must have at least one instrument"
        setTimeout(() => {
          this.errorDivMessage = ""
          
        }, 2000)
        
        return;
      })

      // console.log(res)
      if(res){
        
        event.source._checked=false
      } else {
          event.source._checked=true
      }
    } 
  }

}
