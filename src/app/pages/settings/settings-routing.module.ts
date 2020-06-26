import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaveGuard } from 'src/app/shared';

import { SettingAccountComponent } from './setting-account/setting-account.component';
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
        canDeactivate: [LeaveGuard],
      },
      {
        path: 'account',
        component: SettingAccountComponent,
      },
      {
        path: '',
        redirectTo: 'account',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
