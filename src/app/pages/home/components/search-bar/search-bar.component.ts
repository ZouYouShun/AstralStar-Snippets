import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';

import {
  getCursorPosition,
  IpcEventType,
  setCursor,
  SnippetModel,
  SnippetsService,
} from '../../../../core';

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

  get previewSnippet(): SnippetModel {
    return (
      this.searchResult[this.selectIndex] || this._snippets.previousSnippet
    );
  }

  searchResult: SnippetModel[] = [];

  constructor(private _snippets: SnippetsService) {}

  ngOnInit(): void {
    window.addEventListener(
      'keydown',
      (e) => {
        switch (e.code) {
          case 'Escape':
            this._snippets.sendIpc(IpcEventType.EXIT, true);
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
              this.searchResult = this._snippets.snippets;
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

  ngAfterViewInit(): void {
    this.items.changes.subscribe((x) => {
      this._setCurrentHeight();
    });
  }

  change(value: string): void {
    this.searchResult =
      value !== ''
        ? this._snippets.snippets.filter(
            (snippet) => snippet.key.slice(0, value.length) === value
          )
        : [];

    this.currentHeight = this.mainElm.nativeElement.clientHeight;
    this.selectIndex = 0;
  }

  choice(snippet: SnippetModel): void {
    const { applyTextDirectly, copyToKeyboard } = this._snippets;

    const message =
      [
        applyTextDirectly && IpcEventType.APPLY,
        copyToKeyboard && IpcEventType.COPY,
      ]
        .filter((x) => !!x)
        .join('_') || IpcEventType.COPY;

    this._snippets.sendIpc(message, snippet);
  }

  hover(i: number): void {
    console.log(i);
    this.selectIndex = i;
  }

  goSettings() {
    this._snippets.sendIpcSync(IpcEventType.GO_SETTINGS);
  }

  private _setCurrentHeight(): void {
    this.currentHeight = this.mainElm.nativeElement.clientHeight;
    this._snippets.sendIpc(IpcEventType.HEIGHT, this.currentHeight);
  }
}
