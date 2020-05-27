import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReasonsPage } from './reasons.page';

const routes: Routes = [
  {
    path: '',
    component: ReasonsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReasonsPageRoutingModule {}
