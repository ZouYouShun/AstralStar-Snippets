import { Component, OnInit } from '@angular/core';
import { SnippetsService, SnippetModel } from 'src/app/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'st-setting-snippets',
  templateUrl: './setting-snippets.component.html',
  styleUrls: ['./setting-snippets.component.scss'],
})
export class SettingSnippetsComponent implements OnInit {
  isPreview = false;

  snippets = this._snippets.snippets;

  formGroup: FormGroup = this._fb.group({
    snippets: this._fb.array([]),
  });

  constructor(private _fb: FormBuilder, private _snippets: SnippetsService) {}

  private createFormGroup(
    { key, value, isEdit }: SnippetModel = {} as any
  ): any {
    return this._fb.group({
      key: [key || '', []],
      value: [value || '', []],
      isEdit: [isEdit || false, []],
    });
  }

  ngOnInit(): void {
    this.formGroup.get('snippets');
  }

  add(): void {
    this._snippets.new();
  }

  edit(i: number) {
    this.snippets[i].isEdit = true;
  }

  save(i: number) {
    this.snippets[i].isEdit = false;
  }

  remove(i: number) {
    this.snippets.splice(i, 1);
  }

  togglePreview() {
    this.isPreview = !this.isPreview;
  }
}
