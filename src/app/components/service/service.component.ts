import { Component, OnInit, Input } from '@angular/core';
import { Platform } from '@ionic/angular';

import { Observable } from 'rxjs';
import { Category, Job, Schedule, JobPartner } from '../../model/model';
import { JobsService } from '../../services/jobs.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoriesService } from '../../services/categories.service';
import { DataService } from '../../services/data.service';
import { ScheduleService } from '../../services/schedule.service';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { of } from 'rxjs';
import { ServiceProviderService } from '../../services/service-provider.service';
import { StorageService } from '../../services/storage.service';
import { AuthConstants } from '../../config/auth-constants';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss'],
})
export class ServiceComponent implements OnInit {
  @Input('categoryId') categoryId: string;
  @Input('schedule') schedule: Schedule;
  public myIndex: string = '';
  public dropdown1: string = '2';
  test: Category[];
  categorySelected: string;
  categories: Observable<Category[]>;
  jobPartner = [];

  jobs = [];
  data: {
    id: ""
  }
  name = 'Angular 6';
  @Input() form: FormGroup;
  ordersData = [];
  firstFormGroup: FormGroup;
  items = [
    { key: 'item1', text: 'value1' },
    { key: 'item2', text: 'value2' },
    { key: 'item3', text: 'value3' },
  ];

  constructor(
    private platForm: Platform,
    private dataCategory: CategoriesService,
    private jobService: JobsService,
    private route: ActivatedRoute,
    private dataService: DataService,
    private scheduleService: ScheduleService,
    private formBuilder: FormBuilder,
    private serviceDataProvider: ServiceProviderService,
    private storageService: StorageService

  ) {
    console.log("category " + this.categoryId);

  }

  ngOnInit() {




    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.jobService.getJobs(id).subscribe(jobs => {


    

        this.storageService.get(AuthConstants.USER_ID).then(userId => {
          this.serviceDataProvider.getServiceProviders(userId).subscribe(servieProvider => {
            console.log(userId);
         
            if (jobs.length !== 0) {
       
              this.jobs = jobs;
              this.loadService(jobs, servieProvider);
            }else{
              this.jobs = jobs;
            }
          });
        });


        // this.scheduleService.getSchedule().subscribe(schedule => {
        //   this.jobs = jobs;
        //   if (schedule && schedule.job) {

        //     // this.addCheckboxes(); 
        //   }
        // });

      })

    }

  }



  onCheckboxChange(value, index, job?) {
    console.log(index);

    const checkArray: FormArray = this.form.get('jobsGroup').get('jobsArray') as FormArray;

    if (value == null) {
      checkArray.push(new FormControl(job));
    }
    else if (value.isSelected) {

      console.log(document.getElementById('price' + index));


      // Add a new control in the arrayForm

      this.changeCheckbox();

      checkArray.push(new FormControl(value));
    } else {

      this.changeCheckbox();
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {

        if (item.value.name == value.name) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }





  loadService(jobs, scheduleJob) {
    for (let job of jobs) {
      let data = this.isJobExist(job, scheduleJob);
      if (data) {
        this.onCheckboxChange(null, null, job);
        job.isSelected = true;

        if (data.price !== 0) {
          job.minimunPrice = data.price;
        }
      }
    }


  }

  isJobExist(job, scheduleJob): Job {
    for (let i of scheduleJob) {   
      if (i.serviceId === job.id) {
        return i;
      }
    }
    return null;
  }
  onchange($event) {
  }

  changeCheckbox() {
    this.scheduleService.isJobDirty = true;  

    this.scheduleService.setJobPartner(this.jobs);
  }





}

