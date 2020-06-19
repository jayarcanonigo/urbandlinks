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
 //   this.storage.store(AuthConstants.USER_ID, 'i16Xuqp8ObZMgKXEzYwz');
    let id = route.paramMap.get('id');
   
    let userId;
    if (id) {
      this.storage.get(AuthConstants.USER_ID).then(userId => {
        userId = userId;
      });
    }

   // userId = 'i16Xuqp8ObZMgKXEzYwz';
  //  console.log(id);
   // console.log(userId);
    
    
    return this.scheduleService.getScheduleByCategoryAndUserId(id, userId);
  }
}