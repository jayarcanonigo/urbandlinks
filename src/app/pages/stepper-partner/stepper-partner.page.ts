import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { ScheduleService } from '../../services/schedule.service';
import { Schedule, User } from '../../model/model';
import { AuthConstants } from '../../config/auth-constants';
import { LocationService } from '../../services/location.service';
import { Observable } from 'rxjs';
import { TimeScheduleComponent } from '../../components/time-schedule/time-schedule.component';
import { ServiceComponent } from '../../components/service/service.component';

@Component({
  selector: 'app-stepper-partner',
  templateUrl: './stepper-partner.page.html',
  styleUrls: ['./stepper-partner.page.scss'],
})
export class StepperPartnerPage implements OnInit {
  firstFormGroup: FormGroup;
  user: User;
  master = 'Master';
  schedule: Schedule;
  categoryId: string;
  phoneNumber: string;
  isTest = false;
  currentLocation: Observable<string>;
  jobCount: Observable<number>;

  days = [];
  constructor(private activatedRoute: ActivatedRoute, private storage: StorageService,
    private scheduleService: ScheduleService, private _formBuilder: FormBuilder,
    private location: LocationService, private router: Router

  ) { }

  ngOnInit() {
    this.currentLocation = this.location.getCurrentLocation();
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.jobCount = this.scheduleService.getDaysCount();
    this.storage.get(AuthConstants.AUTH).then(res => {
      if (id) {
        this.categoryId = id;
        this.phoneNumber = res.phoneNumber + "";
        this.scheduleService.getScheduleByCategoryAndUserId(id, res.phoneNumber + '').subscribe(schedule => {
          this.schedule = schedule;
          this.days = ['Mon', 'Tue', 'Wen', 'Thur', 'Fri', 'Sat', 'Sun'];
        });
      }
    });
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }
  gotoLocation() {
    this.router.navigate(['home/google-map']);
  }

  ionViewWillEnter() {



  }

  onSequenceChangeEvent($event) {

    // this.scheduleService.removeDayTime('Mon');
    //console.log($event);

  }
  addSchedule() {

    this.location.getCurrentLocation().subscribe(address => {
      this.schedule = {
        userId: this.phoneNumber,
        categoryId: this.categoryId,
        day: this.scheduleService.getDays(),
        job: this.scheduleService.getJobPartner(),
        address: address

      }
      this.scheduleService.addSchedule(this.schedule).then(data => {
        this.schedule.id = data.id;
      });
    })

  }

  updateSchedule() {
    this.location.getCurrentLocation().subscribe(address => {
      this.schedule.day = this.scheduleService.getDays();
      this.schedule.job = this.scheduleService.getJobPartner();
      this.schedule.address = address;
      this.scheduleService.updateSchedule(this.schedule);
    });
  }
  isLinear = false;
  secondFormGroup: FormGroup;


}
