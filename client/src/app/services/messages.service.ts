import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import MessageUnitModel from '../models/message-unit.model';
import { ExploreService } from './explore.service';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  public conversation: {
    profile_img_src: string;
    username: string;
    _id: string;
    groupConversation: boolean;
    messages:MessageUnitModel[];
  } = {
    profile_img_src: '',
    username: '',
    _id: '',
    groupConversation: false,
    messages: [],
  };

  public preview: MessageUnitModel[] = [];

  public groupInfo: {
    name: string;
    group_img_src: string;
    members: {
      username: string;
      profile_img_src: string;
      _id: string;
    }[];
    admins: {
      username: string;
      profile_img_src: string;
      _id: string;
    }[];
  } = {
    name: '',
    group_img_src: '',
    members: [],
    admins: [],
  };

  constructor(public _http: HttpClient, 
    public _users: UsersService,
    public _explore: ExploreService,
    ) {}

  public async sendMessage(
    to: string,
    content: string,
    isJoinReq: boolean
  ): Promise<boolean> {
    const res: any = await this._http
      .post(
        'http://localhost:666/api/messages/',
        {
          to,
          content,
          isJoinReq,
        },
        {
          headers: {
            authorization: localStorage.token,
          },
        }
      )
      .toPromise();
    if (res.ok) {
      console.log(res.ok);
      this.conversation.messages.push({
        content,
        _id: "",
        isJoinReq,
        from: {
          _id: this._users.userInfo._id,
          username: this._users.userInfo.username,
          profile_img_src: this._users.userInfo.profile_img_src
        },
        to:{
          username: "",
          _id: res._id,
          profile_img_src: this._explore.profile.profile_img_src
        },
        status: '',
        date: new Date(),
        type: ""
      });
      if(isJoinReq){
        this._users.userInfo.joinReqsWithUsers.push(to)
      }
      return true;
    }
    console.log(res.fail);
    return false;
  }

  public async delMessage(id: string): Promise<boolean> {
    const res: any = await this._http
      .delete('http://localhost:666/api/messages/' + id, {
        headers: {
          authorization: localStorage.token,
        },
      })
      .toPromise();
    if (res.ok) {
      console.log(res.ok);
      return true;
    }
    console.log(res.fail);
    return false;
  }

  public async getConversation(withId: string): Promise<boolean> {
    const res: any = await this._http
      .post('http://localhost:666/api/messages/conversation/' + withId, {} ,{
        headers: {
          authorization: localStorage.token,
        },
      })
      .toPromise();
    if (res.ok) {
      console.log(res.ok);
      this.conversation = res.conversation;
      console.log('Conversation: ', res.conversation);
      return true;
    }
    console.log(res.fail);
    return false;
  }

  public async getPreview(): Promise<boolean> {
    const res: any = await this._http
      .get('http://localhost:666/api/messages/preview', {
        headers: {
          authorization: localStorage.token,
        },
      })
      .toPromise();
    if (res.ok) {
      console.log(res.ok);
      this.preview = res.preview;
      console.log('Preview: ', res.preview);
      return true;
    }
    console.log(res.fail);
    return false;
  }

  public async getGroupInfo(groupId: string): Promise<boolean> {
    const res: any = await this._http
      .get('http://localhost:666/api/messages//group/info/' + groupId, {
        headers: {
          authorization: localStorage.token,
        },
      })
      .toPromise();
    if (res.ok) {
      console.log(res.ok);
      this.groupInfo = res.groupInfo;
      console.log('groupInfo: ', res.groupInfo);
      return true;
    }
    console.log(res.fail);
    return false;
  }

  public async respondJoinReq(
    answer: string,
    messageId: string
  ): Promise<boolean> {
    const res: any = await this._http
      .put(
        'http://localhost:666/api/messages/replyJoinRequest/' + messageId,
        {
          answer,
        },
        {
          headers: {
            authorization: localStorage.token,
          },
        }
      )
      .toPromise();
    if (res.ok) {
      console.log(res.ok);
      const message = this.conversation.messages.find(m=>m._id===messageId)
      if(message){
        if(answer==="approve"){
          message.status = "approved"
        }
        if(answer==="reject"){
          message.status = "rejected"
        }
        if(answer==="cancel"){
          message.status = "canceled"
        }
      }
      return true;
    }
    console.log(res.fail);
    return false;
  }

  public async createGroup(userIds: string[], name: string): Promise<boolean> {
    const res: any = await this._http
      .post(
        'http://localhost:666/api/messages/group',
        {
          userIds,
          name,
        },
        {
          headers: {
            authorization: localStorage.token,
          },
        }
      )
      .toPromise();
    if (res.ok) {
      console.log(res.ok);
      console.log(res)
      return res.groupId;
    }
    console.log(res.fail);
    return false;
  }

  public async deleteGroup(groupId: string): Promise<boolean> {
    const res: any = await this._http
      .delete('http://localhost:666/api/messages/group/' + groupId, {
        headers: {
          authorization: localStorage.token,
        },
      })
      .toPromise();
    if (res.ok) {
      console.log(res.ok);
      return true;
    }
    console.log(res.fail);
    return false;
  }

  public async makeAdmin(
    groupId: string,
    toBeAdminned: string
  ): Promise<boolean> {
    const res: any = await this._http
      .put(
        'http://localhost:666/api/messages/group/admin/' + toBeAdminned,
        {
          groupId,
        },
        {
          headers: {
            authorization: localStorage.token,
          },
        }
      )
      .toPromise();
    if (res.ok) {
      console.log(res.ok);
      return true;
    }
    console.log(res.fail);
    return false;
  }

  public async removeAdmin(groupId: string): Promise<boolean> {
    const res: any = await this._http
      .post(
        'http://localhost:666/api/messages/group/admin/removeSelf',
        {
          groupId,
        },
        {
          headers: {
            authorization: localStorage.token,
          },
        }
      )
      .toPromise();
    if (res.ok) {
      console.log(res.ok);
      return true;
    }
    console.log(res.fail);
    return false;
  }

  public async leaveGroup(groupId: string): Promise<boolean> {
    const res: any = await this._http
      .post(
        'http://localhost:666/api/messages/group/leave',
        {
          groupId,
        },
        {
          headers: {
            authorization: localStorage.token,
          },
        }
      )
      .toPromise();
    if (res.ok) {
      console.log(res.ok);
      return true;
    }
    console.log(res.fail);
    return false;
  }

  public async addMember(groupId: string, toBeAdded: string): Promise<boolean> {
    const res: any = await this._http
      .post(
        'http://localhost:666/api/messages/group/addMember/' + toBeAdded,
        {
          groupId,
        },
        {
          headers: {
            authorization: localStorage.token,
          },
        }
      )
      .toPromise();
    if (res.ok) {
      console.log(res.ok);
      return true;
    }
    console.log(res.fail);
    return false;
  }
}
