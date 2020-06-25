import { Component } from '@angular/core';

import { ElectronService } from './core';

@Component({
  selector: 'st-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'snippets-tool';
  constructor() {}
}
