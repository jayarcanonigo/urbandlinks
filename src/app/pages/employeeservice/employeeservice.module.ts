import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeeservicePageRoutingModule } from './employeeservice-routing.module';

import { EmployeeservicePage } from './employeeservice.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeeservicePageRoutingModule
  ],
  declarations: [EmployeeservicePage]
})
export class EmployeeservicePageModule {}
