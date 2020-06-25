import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../core';

interface Snippet {
  key: string;
  value: string;
}

@Component({
  selector: 'st-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  searchText = '';

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

  ngOnInit(): void {}

  change(e: any): void {
    console.log(e);
    this.searchResult =
      e !== ''
        ? this.snippets.filter((snippet) =>
            `${snippet.value} ${snippet.key}`.includes(e)
          )
        : [];
  }

  choice(snippet: Snippet): void {
    this.electronService.ipcRenderer.send('message', snippet);
  }
}
