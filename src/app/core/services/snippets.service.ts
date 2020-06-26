import { Injectable } from '@angular/core';

import { SnippetModel } from '../models';

@Injectable({
  providedIn: 'root',
})
export class SnippetsService {
  snippets: SnippetModel[] = [
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

  constructor() {}

  new(): void {
    this.snippets.unshift({
      key: '',
      value: '',
    });
  }

  save(value: SnippetModel[]) {
    this.snippets = value;
  }
}
