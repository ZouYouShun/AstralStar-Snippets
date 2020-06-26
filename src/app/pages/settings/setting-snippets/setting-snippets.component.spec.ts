import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingSnippetsComponent } from './setting-snippets.component';

describe('SettingSnippetsComponent', () => {
  let component: SettingSnippetsComponent;
  let fixture: ComponentFixture<SettingSnippetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingSnippetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingSnippetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
