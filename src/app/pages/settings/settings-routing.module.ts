import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SettingSnippetsComponent } from './setting-snippets/setting-snippets.component';
import { SettingsComponent } from './settings.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: 'snippets',
        component: SettingSnippetsComponent,
      },
      {
        path: 'account',
        component: SettingSnippetsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
