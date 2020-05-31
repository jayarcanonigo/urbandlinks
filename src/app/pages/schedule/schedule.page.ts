import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { ScheduleService } from '../../services/schedule.service';
import { Schedule, User } from '../../model/model';
import { AuthConstants } from '../../config/auth-constants';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {
  user: User;
  master = 'Master';
  schedule: Schedule;
  categoryId: string;
  phoneNumber: string;
  days =[];
  constructor(private activatedRoute: ActivatedRoute, private storage: StorageService,
    private scheduleService: ScheduleService

  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.storage.get(AuthConstants.AUTH).then(res => {
      if (id) {
        this.categoryId = id;
        this.phoneNumber = res.phoneNumber + "";
        this.scheduleService.getScheduleByCategoryAndUserId(id, res.phoneNumber + '').subscribe(schedule => {
          this.schedule = schedule;
          this.days =  ['Mon', 'Tue', 'Wen', 'Thur', 'Fri', 'Sat', 'Sun'];   
        });
      }
    });


  }

  onSequenceChangeEvent($event) {

    // this.scheduleService.removeDayTime('Mon');
    //console.log($event);

  }
  addSchedule() {
    this.schedule = {
      userId: this.phoneNumber,
      categoryId: this.categoryId,
      day: this.scheduleService.getDays(),
      job: [],
      address : null,
      imageURL: "",
      imageFullPath: ""
        }
    this.scheduleService.addSchedule(this.schedule).then(data=>{
      this.schedule.id =  data.id;
    });       
  }

  updateSchedule(){
    console.log('update ', this.schedule);
    
    this.schedule.day = this.scheduleService.getDays();
    this.scheduleService.updateSchedule(this.schedule); 
    }



}
