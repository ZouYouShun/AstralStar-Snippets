import {
  Component,
  OnInit,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'st-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent implements OnInit {
  // @ViewChildren('isActive') isActive;
  links = [
    {
      title: 'Account',
      path: './account',
    },
    {
      title: 'Snippets',
      path: './snippets',
    },
  ];

  constructor() {}

  ngOnInit(): void {
    // setTimeout(() => {
    //   console.log(this.isActive);
    // }, 100);
  }
}
