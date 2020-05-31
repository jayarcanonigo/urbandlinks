import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlidesComponent } from './slides/slides.component';
import { LogoComponent } from './logo/logo.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StartComponent } from './start/start.component';
import { HeaderComponent } from './header/header.component';
import { TimeScheduleComponent } from './time-schedule/time-schedule.component';
import { MaterialModule } from '../material.module';
import { ServiceComponent } from './service/service.component';
import { LocationComponent } from './location/location.component';
import { InfoComponent } from './info/info.component';



@NgModule({
  declarations: [SlidesComponent, LogoComponent,StartComponent,HeaderComponent,
     TimeScheduleComponent,LocationComponent, InfoComponent, 
     ServiceComponent],
  exports:[SlidesComponent, LogoComponent,StartComponent, HeaderComponent,
     TimeScheduleComponent, LocationComponent, ServiceComponent, InfoComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule ,
    MaterialModule,
    ReactiveFormsModule

  ]
})
export class ComponentsModule { }
