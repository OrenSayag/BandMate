import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import CommentsModel from '../models/comments.model';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(
    public _http:HttpClient,
    public _users:UsersService,
  ) { }

  public async postPost(
    content: string,
    isPrivate: boolean,
    fileSrc: string,
    bandId: string,
    mediaType: string,
  ): Promise<boolean> {
    const res: any = await this._http
      .post(
        'http://localhost:666/api/posts',
        // '/api/posts',
        {
          bandId,
          isPrivate,
          mediaType,
          fileSrc,
          content
        },
        {
          headers: {
            'content-type': 'application/json',
            authorization: localStorage.token,
          },
        }
      )
      .toPromise();

    if (res.ok) {
      // console.log('succesfully added post');
      this._users.userInfo.userFeed.push({
        fileSrc,
        content,
        parentUser: {
          profile_img_src: this._users.userInfo.profile_img_src,
          _id: this._users.userInfo._id,
          participants: [],
          username: ""
        },
        date: new Date(),
        comments: [],
        likes: [],
        isPrivate,
        type: "post",
        mediaType,
        _id: res._id
      })
      return true
    } else {
      // console.log('failed to add post');
      return false
    }
  }

  // public async getSingleRecording(
  //   id:string
  // ):Promise<Recording|boolean>{
  //   const res:any = await this._http.get('http://localhost:666/api/bank/'+id, {
  //     headers:{
  //       "content-type":"application/json",
  //       authorization:localStorage.token
  //     }
  //   }).toPromise().catch(err=>console.log(err))

  //   if(res.ok){
  //     console.log("succefuly fetched recording")
  //     return res.recording
  //   }
  //   console.log("coudln't fetch recording")
  //   return false
  // }

  public async likePost(id:string): Promise<boolean> {
    const res: any = await this._http
      .put(
        'http://localhost:666/api/posts/like/'+id,
        // '/api/posts/like/'+id,
        {
          
        },
        {
          headers: {
            'content-type': 'application/json',
            authorization: localStorage.token,
          },
        }
      )
      .toPromise();

    if (res.ok) {
      // console.log('succesfully un/liked recording');
      return true
    } else {
      // console.log('failed to un/like recording');
      return false
    }
  }

  public async postCommentPost(id:string, text:string): Promise<boolean|string> {
    const res: any = await this._http
      .post(
        'http://localhost:666/api/posts/comment/'+id,
        // '/api/posts/comment/'+id,
        {
          text
        },
        {
          headers: {
            'content-type': 'application/json',
            authorization: localStorage.token,
          },
        }
      )
      .toPromise();

    if (res.ok) {
      // console.log('succesfully commented post');
      return res.id
    } else {
      // console.log('failed to comment post');
      return false
    }
  }

  public async delCommentPost(postId:string,commentId:string): Promise<boolean> {
    const res: any = await this._http
      .delete(
        'http://localhost:666/api/posts/comment/'+postId+'/'+commentId,
        // '/api/posts/comment/'+postId+'/'+commentId,
        {
          headers: {
            'content-type': 'application/json',
            authorization: localStorage.token,
          },
        }
      )
      .toPromise();

    if (res.ok) {
      // console.log('succesfully deleted comment from post');
      return true
    } else {
      // console.log('failed to delete comment post');
      return false
    }
  }

  public async delPost(postId:string): Promise<boolean> {
    const res: any = await this._http
      .delete(
        'http://localhost:666/api/posts/'+postId,
        // '/api/posts/'+postId,
        {
          headers: {
            'content-type': 'application/json',
            authorization: localStorage.token,
          },
        }
      )
      .toPromise();

    if (res.ok) {
      // console.log('succesfully deleted post');
      return true
    } else {
      // console.log('failed to delete post');
      return false
    }
  }
}
