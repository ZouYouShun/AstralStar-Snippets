import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { SettingSnippetsComponent } from './setting-snippets/setting-snippets.component';

@NgModule({
  declarations: [SettingsComponent, SettingSnippetsComponent],
  imports: [SharedModule, SettingsRoutingModule],
})
export class SettingsModule {}
