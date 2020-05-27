import { Component, OnInit, Input } from '@angular/core';
import { Platform } from '@ionic/angular';

import { Observable } from 'rxjs';
import { Category, Job, Schedule, JobPartner } from '../../model/model';
import { JobsService } from '../../services/jobs.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoriesService } from '../../services/categories.service';
import { DataService } from '../../services/data.service';
import { ScheduleService } from '../../services/schedule.service';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';


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
  firstFormGroup: FormGroup;
  items = [
    {key: 'item1', text: 'value1'},
    {key: 'item2', text: 'value2'},
    {key: 'item3', text: 'value3'},
  ];

  constructor(
    private platForm: Platform,
    private dataCategory: CategoriesService,
    private jobService: JobsService,
    private route: ActivatedRoute,
    private dataService: DataService,
    private scheduleService: ScheduleService,
    private fb: FormBuilder

  ) {
    console.log("category " + this.categoryId);

  }

  ngOnInit() {
    this.firstFormGroup = this.fb.group({
      firstCtrl: ['', Validators.required]
    });
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.jobService.getJobs(id).subscribe(jobs => {
        this.scheduleService.getSchedule().subscribe(schedule => {
          this.jobs = jobs;
          if (schedule && schedule.job) {
            this.loadService(schedule);
          }
        });

      })

    }
   
  }

  mapItems(items) {
    let selectedItems = items.filter((item) => item.checkbox).map((item) => item.id);
    return selectedItems.length ? selectedItems : null;
  }
  loadService(schedule) {
    for (let job of this.jobs) {
      if (this.isJobExist(job, schedule)) {
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
    this.scheduleService.setJobPartner(this.jobs);
  }






}
