import { Injectable } from '@angular/core';

import { SnippetModel, IpcEventType } from '../models';
import { LocalStorageService } from 'src/app/shared/services';
import { prefix } from '../utils';
import { ElectronService } from './electron.service';

const STORAGE_KEY = prefix(
  ['copyToKeyboard', 'applyTextDirectly', 'snippets'],
  'SnippetsService'
);

@Injectable({
  providedIn: 'root',
})
export class SnippetsService {
  previousSnippet: SnippetModel;

  get copyToKeyboard() {
    return this._copyToKeyboard;
  }
  set copyToKeyboard(value) {
    this._copyToKeyboard = value;
    this._storage.setItem(STORAGE_KEY.copyToKeyboard, value);
  }

  get applyTextDirectly() {
    return this._applyTextDirectly;
  }
  set applyTextDirectly(value) {
    this._applyTextDirectly = value;
    this._storage.setItem(STORAGE_KEY.applyTextDirectly, value);
  }

  get snippets(): SnippetModel[] {
    return this._snippets;
  }
  set snippets(value: SnippetModel[]) {
    this._snippets = value;
    this._storage.setItem(STORAGE_KEY.snippets, value);
  }

  private _snippets: SnippetModel[] =
    this._storage.getItem(STORAGE_KEY.snippets) ?? [];

  private _copyToKeyboard =
    this._storage.getItem(STORAGE_KEY.copyToKeyboard) ?? false;

  private _applyTextDirectly =
    this._storage.getItem(STORAGE_KEY.applyTextDirectly) ?? true;

  constructor(
    private _storage: LocalStorageService,
    private _electron: ElectronService
  ) {
    const latestSnippet = this.sendIpcSync(IpcEventType.PREVIOUS_SNIPPET);
    console.log(latestSnippet);
    this.previousSnippet = this.snippets.find(
      (snippet) => snippet.value === latestSnippet
    );
  }

  new(): void {
    this.snippets.unshift({
      key: '',
      value: '',
    });
  }

  save(value: SnippetModel[]) {
    this.snippets = value;
  }

  sendIpc(snippet: string, value: any): void {
    this._electron.ipcRenderer.send(snippet, value);
  }

  sendIpcSync(snippet: string, value?: any) {
    return this._electron.ipcRenderer.sendSync(snippet, value);
  }
}
