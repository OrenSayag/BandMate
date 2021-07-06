import { Component, OnInit } from '@angular/core';
import { ExploreService } from 'src/app/services/explore.service';
import { PostsService } from 'src/app/services/posts.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  public formTog:Boolean = false;

  public async killPost(e:any){
    const res = await this._posts.delPost(e)
    if(res){
      this._users.userInfo.userFeed = this._users.userInfo.userFeed.filter(p=>p._id!=e)
      // this._explore.exploreListContent = this._explore.exploreListContent.filter(p=>p._id!=e)
      // this._users.mainContent.logs = []
    }
  }
  
  constructor(
    public _users:UsersService,
    public _posts:PostsService,
    public _explore:ExploreService,
    
    ) { }
    
    async ngOnInit(): Promise<void> {
      await this._users.getFeed()
      console.log(this._users.userInfo.userFeed)
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
