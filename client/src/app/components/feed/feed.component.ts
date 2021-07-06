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
    
    async ngOnInit(): Promise<void> {
      await this._users.getFeed()
      console.log(this._users.userFeed)
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
