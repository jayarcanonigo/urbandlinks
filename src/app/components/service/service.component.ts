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
    private formBuilder: FormBuilder

  ) {
    console.log("category " + this.categoryId);

  }

  ngOnInit() {




    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.jobService.getJobs(id).subscribe(jobs => {

        this.jobs = jobs;

        this.scheduleService.getSchedule().subscribe(schedule => {
          this.jobs = jobs;
          if (schedule && schedule.job) {
            this.loadService(schedule);
            // this.addCheckboxes(); 
          }
        });

      })

    }

  }

  onCheckboxChange(event, job?) {
   
    const checkArray: FormArray = this.form.get('jobsGroup').get('jobsArray') as FormArray;
    if (event == null) {
      checkArray.push(new FormControl(job));
    }
    else if (event.target.checked) {
      // Add a new control in the arrayForm
      event.target.value.isSelected = true;
      this.changeCheckbox();
      checkArray.push(new FormControl(event.target.value));
    } else {
      event.target.value.isSelected = false;
      this.changeCheckbox();
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value.name == event.target.value.name) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }



 

  loadService(schedule) {
    for (let job of this.jobs) {
      if (this.isJobExist(job, schedule)) {
        this.onCheckboxChange(null, job),
          job.isSelected = true;
      }
    }

  }

  isJobExist(job, schedule): boolean {
    for (let i of schedule.job) {
      if (i.name === job.name) {
        return true;
      }
    }
    return false;
  }
  onchange($event) {
  }

  changeCheckbox() {
    this.scheduleService.isJobDirty = true;
    this.scheduleService.setJobPartner(this.jobs);
  }






}

