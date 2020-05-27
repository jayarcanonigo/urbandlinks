import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BadgesPageRoutingModule } from './badges-routing.module';

import { BadgesPage } from './badges.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BadgesPageRoutingModule,
    ComponentsModule
  ],
  declarations: [BadgesPage]
})
export class BadgesPageModule {}
