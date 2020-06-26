import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './pages/home/home.module';
import { SettingsModule } from './pages/settings/settings.module';
import { BEFORE_UNLOAD_MESSAGE } from './shared';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    HomeModule,
    SettingsModule,
  ],
  providers: [
    {
      provide: BEFORE_UNLOAD_MESSAGE,
      useValue: 'Not save yet! confirm leave?',
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
