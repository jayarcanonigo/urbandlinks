import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicelistPage } from './servicelist.page';

const routes: Routes = [
  {
    path: '',
    component: ServicelistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicelistPageRoutingModule {}
