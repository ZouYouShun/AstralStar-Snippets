import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ElectronService, IpcEventType } from './core';

@Component({
  selector: 'st-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private _router: Router, private _electron: ElectronService) {}

  ngOnInit() {
    const currentRoute = this._electron.ipcRenderer.sendSync(
      IpcEventType.INIT_ROUTE
    );

    console.log(currentRoute);

    if (this._router.url !== currentRoute) {
      this._router.navigateByUrl(currentRoute);
    }
  }
}
