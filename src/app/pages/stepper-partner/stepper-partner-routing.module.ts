import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepperPartnerPage } from './stepper-partner.page';

const routes: Routes = [
  {
    path: '',
    component: StepperPartnerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepperPartnerPageRoutingModule {}
