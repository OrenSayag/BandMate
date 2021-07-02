import { Component } from '@angular/core';
import { LogsService } from './services/logs.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';

  constructor(public _logs:LogsService) { }

  ngOnInit(): void {
    // this._logs.getUserLogs()
  }
}
