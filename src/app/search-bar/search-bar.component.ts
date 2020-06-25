import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  AfterViewInit,
} from '@angular/core';

import { ElectronService } from '../core';

interface Snippet {
  key: string;
  value: string;
}

enum IpcEventType {
  MESSAGE = 'MESSAGE',
  HEIGHT = 'HEIGHT',
  EXIT = 'EXIT',
}

@Component({
  selector: 'st-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit, AfterViewInit {
  @ViewChild('main', { static: true }) mainElm: ElementRef<HTMLDivElement>;
  @ViewChildren('item') items: QueryList<HTMLLIElement>;

  searchText = '';

  currentHeight = 0;

  selectIndex = 0;

  snippets: Snippet[] = [
    {
      key: 'ga',
      value: 'ga732423alan!!!202004',
    },
    {
      key: 'ga1',
      value: 'ga',
    },
    {
      key: 'ga2',
      value: 'ga',
    },
    {
      key: 'ga3',
      value: 'ga',
    },
    {
      key: 'ga4',
      value: 'ga',
    },
  ];

  searchResult = [];

  constructor(private electronService: ElectronService) {}

  ngOnInit(): void {
    this._setCurrentHeight();

    window.addEventListener(
      'keyup',
      (e) => {
        console.log('exit', e);
        switch (e.code) {
          case 'Escape':
            this._sendIpc(IpcEventType.EXIT, true);
            break;
          case 'ArrowUp':
            e.preventDefault();
            this.selectIndex = Math.max(0, this.selectIndex - 1);
            break;
          case 'ArrowDown':
            e.preventDefault();
            this.selectIndex = Math.min(
              this.searchResult.length - 1,
              this.selectIndex + 1
            );
            break;
          case 'Enter':
            break;

          default:
            break;
        }
      },
      true
    );
  }

  private _setCurrentHeight(): void {
    this.currentHeight = this.mainElm.nativeElement.clientHeight;
    this._sendIpc(IpcEventType.HEIGHT, this.currentHeight);
  }

  ngAfterViewInit(): void {
    this.items.changes.subscribe((x) => {
      this._setCurrentHeight();
    });
  }

  change(e: any): void {
    this.searchResult =
      e !== ''
        ? this.snippets.filter((snippet) =>
            `${snippet.value} ${snippet.key}`.includes(e)
          )
        : [];

    this.currentHeight = this.mainElm.nativeElement.clientHeight;
    this.selectIndex = 0;
  }

  choice(snippet: Snippet): void {
    this._sendIpc(IpcEventType.MESSAGE, snippet);
  }

  hover(i: number): void {
    console.log(i);
    this.selectIndex = i;
  }

  private _sendIpc(snippet: IpcEventType, value: any): void {
    this.electronService.ipcRenderer.send(snippet, value);
  }
}
