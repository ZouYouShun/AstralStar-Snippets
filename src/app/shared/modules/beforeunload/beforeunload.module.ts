import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BeforeunloadDirective } from './beforeunload.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    BeforeunloadDirective
  ],
  exports: [
    BeforeunloadDirective
  ]
})
export class BeforeunloadModule { }
