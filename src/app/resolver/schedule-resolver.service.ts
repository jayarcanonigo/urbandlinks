import { Injectable } from '@angular/core';
import { ScheduleService } from '../services/schedule.service';
import { ActivatedRouteSnapshot } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { AuthConstants } from '../config/auth-constants';
import { Schedule } from '../model/model';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleResolverService {

  schedule: Schedule;
  constructor(private scheduleService: ScheduleService, private storage: StorageService,
              private authService: AuthService

  ) { }

  resolve(route: ActivatedRouteSnapshot) {
    let id = route.paramMap.get('id');  
    console.log(this.authService.userId + "Uuser Id" );
    
    return this.scheduleService.getScheduleByCategoryAndUserId(id, this.authService.userId);
  }
}