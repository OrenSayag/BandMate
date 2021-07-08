import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import UsersModel from 'src/app/models/users.model';

@Component({
  selector: 'app-explore-profile-item',
  templateUrl: './explore-profile-item.component.html',
  styleUrls: ['./explore-profile-item.component.css']
})
export class ExploreProfileItemComponent implements OnInit {

  @Input()
  public userOrBand:UsersModel = {
    bands: [],
    _id: '',
    instruments: [],
    genres: [],
    isBand: false,
    username: '',
    profile_img_src: '',
    cover_img_src: '',
    following: [],
    followers: []
  };

  constructor(
    public _r:Router
  ) { }

  ngOnInit(): void {
  }

}
