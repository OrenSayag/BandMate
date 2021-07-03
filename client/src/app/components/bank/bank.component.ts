import { Component, OnInit } from '@angular/core';
import { BankService } from 'src/app/services/bank.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css']
})
export class BankComponent implements OnInit {

  public formTog:Boolean = false;
  

  public formListener(e:boolean):void{
    if(e){
      setTimeout(() => {
        this.formTog = false
      }, 2000)
      
    }
  }

  constructor(
    public _users:UsersService,
    public _bank:BankService,

  ) { }

  ngOnInit(): void {
  }

  public formToggler(){
    this.formTog = !this.formTog
  }

}
