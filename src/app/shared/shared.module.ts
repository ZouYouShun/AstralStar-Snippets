import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ContenteditableDirective } from './directives';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [ContenteditableDirective],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ContenteditableDirective,
  ],
  entryComponents: [],
})
export class SharedModule {}
