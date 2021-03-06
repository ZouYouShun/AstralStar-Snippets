import { Component, OnInit } from '@angular/core';
import { SnippetsService } from 'src/app/core';

@Component({
  selector: 'st-setting-account',
  templateUrl: './setting-account.component.html',
  styleUrls: ['./setting-account.component.scss'],
})
export class SettingAccountComponent implements OnInit {
  get copyToKeyboard() {
    return this._snippets.copyToKeyboard;
  }
  set copyToKeyboard(v: string) {
    this._snippets.copyToKeyboard = v;
  }

  get applyTextDirectly() {
    return this._snippets.applyTextDirectly;
  }
  set applyTextDirectly(v: string) {
    this._snippets.applyTextDirectly = v;
  }

  constructor(public _snippets: SnippetsService) {}

  ngOnInit(): void {}
}
