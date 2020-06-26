import { NgModule } from '@angular/core';
import { BeforeunloadModule, SharedModule } from 'src/app/shared';

import { SettingSnippetsComponent } from './setting-snippets/setting-snippets.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';

@NgModule({
  declarations: [SettingsComponent, SettingSnippetsComponent],
  imports: [SharedModule, SettingsRoutingModule],
})
export class SettingsModule {}
