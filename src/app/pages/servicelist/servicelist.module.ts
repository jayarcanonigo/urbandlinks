import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicSelectableModule} from 'ionic-selectable';
import { IonicModule } from '@ionic/angular';

import { ServicelistPageRoutingModule } from './servicelist-routing.module';

import { ServicelistPage } from './servicelist.page';
import { MaterialModule } from '../../material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServicelistPageRoutingModule,
    IonicSelectableModule,
    MaterialModule
  ],
  declarations: [ServicelistPage]
})
export class ServicelistPageModule {}
