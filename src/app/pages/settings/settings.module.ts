import { NgModule } from '@angular/core';
import { BeforeunloadModule, SharedModule } from 'src/app/shared';

import { SettingSnippetsComponent } from './setting-snippets/setting-snippets.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { SettingAccountComponent } from './setting-account/setting-account.component';
import { SettingHeaderComponent } from './components/setting-header/setting-header.component';
import { SettingCheckboxComponent } from './components/setting-checkbox/setting-checkbox.component';

@NgModule({
  declarations: [SettingsComponent, SettingSnippetsComponent, SettingAccountComponent, SettingHeaderComponent, SettingCheckboxComponent],
  imports: [SharedModule, SettingsRoutingModule],
})
export class SettingsModule {}
