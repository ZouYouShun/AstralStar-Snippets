import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingCheckboxComponent } from './setting-checkbox.component';

describe('SettingCheckboxComponent', () => {
  let component: SettingCheckboxComponent;
  let fixture: ComponentFixture<SettingCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
