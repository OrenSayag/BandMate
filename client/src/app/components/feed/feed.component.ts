import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  public formTog:Boolean = false;
  
  constructor(
    public _users:UsersService,
    
    ) { }
    
    ngOnInit(): void {
    }
    
    public formToggler(){
      this.formTog = !this.formTog
    }

    
    public formListener(e:boolean):void{
      if(e){
        setTimeout(() => {
          this.formTog = false
        }, 2000)
        
      }
    }
  }
