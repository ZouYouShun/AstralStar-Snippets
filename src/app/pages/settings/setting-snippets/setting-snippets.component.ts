import { Component, OnInit } from '@angular/core';
import {
  SnippetsService,
  SnippetModel,
  ElectronService,
  IpcEventType,
} from 'src/app/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'st-setting-snippets',
  templateUrl: './setting-snippets.component.html',
  styleUrls: ['./setting-snippets.component.scss'],
})
export class SettingSnippetsComponent implements OnInit {
  isEdit = false;

  formGroup: FormGroup = this._fb.group({
    snippets: this._fb.array([]),
  });

  private _hasChange = false;

  formChange$ = this.formGroup.valueChanges.pipe(
    tap(() => {
      this._hasChange = true;
    })
  );

  beforeunload = () =>
    this._hasChange ? 'Edit aren\'n save, confirm leave?' : false;

  exit = () => {
    this._electron.ipcRenderer.send(IpcEventType.EXIT);
  };

  get snippets() {
    return this.formGroup.get('snippets') as FormArray;
  }

  get sourceSnippets() {
    return this._snippets.snippets;
  }

  constructor(
    private _fb: FormBuilder,
    private _snippets: SnippetsService,
    private _electron: ElectronService
  ) {}

  ngOnInit(): void {
    this.initGroup();
  }

  private initGroup() {
    this.sourceSnippets.forEach((snippet) => {
      this.snippets.push(this._createFormGroup(snippet));
    });
  }

  add(): void {
    this.snippets.insert(0, this._createFormGroup());
  }

  remove(i: number) {
    this.snippets.removeAt(i);
  }

  toggleIsEdit() {
    this.isEdit = !this.isEdit;
    // if that isEdit have be close
    if (!this.isEdit) {
      this._hasChange = false;
    }
  }

  save() {
    this._submit();
    this.toggleIsEdit();
  }

  cancel() {
    this.snippets.clear();
    this.initGroup();
    this.toggleIsEdit();
  }

  private _submit() {
    this._snippets.save(this.snippets.value);
  }

  private _createFormGroup({ id, key, value }: SnippetModel = {} as any): any {
    return this._fb.group({
      id: [id || '', []],
      key: [key || '', []],
      value: [value || '', []],
    });
  }
}
