import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { BEFORE_UNLOAD_FN, BEFORE_UNLOAD_MESSAGE } from './shared';
import { of } from 'rxjs';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, SharedModule, AppRoutingModule],
  providers: [
    {
      provide: BEFORE_UNLOAD_MESSAGE,
      useValue: 'Not save yet! confirm leave?',
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
