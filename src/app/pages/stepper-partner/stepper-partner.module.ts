import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StepperPartnerPageRoutingModule } from './stepper-partner-routing.module';

import { StepperPartnerPage } from './stepper-partner.page';
import { MaterialModule } from '../../material.module';
import { ComponentsModule } from '../../components/components.module';


@NgModule({ 
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StepperPartnerPageRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    ComponentsModule
  ],
  declarations: [StepperPartnerPage]
})
export class StepperPartnerPageModule {}
