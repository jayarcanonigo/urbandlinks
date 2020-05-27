import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupPartnerPage } from './signup-partner.page';

const routes: Routes = [
  {
    path: '',
    component: SignupPartnerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupPartnerPageRoutingModule {}
