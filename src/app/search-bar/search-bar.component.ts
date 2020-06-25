import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';

import { ElectronService, getCursorPosition, setCursor } from '../core';

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
  @ViewChild('textField', { static: true }) textField: ElementRef<
    HTMLDivElement
  >;
  @ViewChildren('item') items: QueryList<ElementRef<HTMLLIElement>>;

  searchText = '';

  currentHeight = 0;

  selectIndex = 0;

  get previewSnippet(): Snippet {
    return this.searchResult[this.selectIndex];
  }

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

  searchResult: Snippet[] = [];

  constructor(private electronService: ElectronService) {}

  ngOnInit(): void {
    window.addEventListener(
      'keydown',
      (e) => {
        console.log('exit', e);
        switch (e.code) {
          case 'Escape':
            this._sendIpc(IpcEventType.EXIT, true);
            break;
          case 'ArrowRight':
            if (this.previewSnippet) {
              const caretPosition = getCursorPosition(
                this.textField.nativeElement
              );

              if (
                caretPosition === this.searchText.length &&
                this.searchText !== this.previewSnippet.key
              ) {
                this.searchText = this.previewSnippet.key;
                this.change(this.searchText);
                // add timeout make that after next render
                setTimeout(() => {
                  setCursor(
                    this.textField.nativeElement,
                    this.searchText.length
                  );
                }, 0);
              }
            }
            break;
          case 'ArrowUp':
            e.preventDefault();
            e.stopPropagation();

            this.selectIndex = Math.max(0, this.selectIndex - 1);
            break;
          case 'ArrowDown':
            e.preventDefault();
            e.stopPropagation();

            if (
              this.searchText === '' &&
              this.searchResult.length === 0 &&
              this.selectIndex === 0
            ) {
              this.searchResult = this.snippets;
              return;
            }

            this.selectIndex = Math.min(
              this.searchResult.length - 1,
              this.selectIndex + 1
            );
            break;
          case 'Enter':
            this.choice(this.previewSnippet);
            break;

          default:
            break;
        }
      },
      true
    );
  }

  private _setCurrentHeight(): void {
    console.log(IpcEventType.HEIGHT);
    this.currentHeight = this.mainElm.nativeElement.clientHeight;
    this._sendIpc(IpcEventType.HEIGHT, this.currentHeight);
  }

  ngAfterViewInit(): void {
    this.items.changes.subscribe((x) => {
      this._setCurrentHeight();
    });
  }

  change(value: string): void {
    this.searchResult =
      value !== ''
        ? this.snippets.filter(
            (snippet) => snippet.key.slice(0, value.length) === value
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
