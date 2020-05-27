import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupPartnerPageRoutingModule } from './signup-partner-routing.module';

import { SignupPartnerPage } from './signup-partner.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignupPartnerPageRoutingModule
  ],
  declarations: [SignupPartnerPage]
})
export class SignupPartnerPageModule {}
