import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategorylistPage } from './categorylist.page';

const routes: Routes = [
  {
    path: '',
    component: CategorylistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategorylistPageRoutingModule {}
