import { Injectable } from '@angular/core';
import LogsModel from '../models/logs.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  public userLogs:LogsModel[] = []

  constructor() { }

  public async getUserLogs(){
    const logs = await fetch(`http://localhost:666/api/logs`)
    this.userLogs = logs
  }
}
