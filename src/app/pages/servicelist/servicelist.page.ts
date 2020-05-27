import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

import { Observable } from 'rxjs';
import { Category, Job } from '../../model/model';
import { JobsService } from '../../services/jobs.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoriesService } from '../../services/categories.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-servicelist',
  templateUrl: './servicelist.page.html',
  styleUrls: ['./servicelist.page.scss'],
})
export class ServicelistPage implements OnInit {
  public myIndex: string = '';
  public dropdown1: string = '2';
  test: Category[];
  categorySelected: string;
  categories: Observable<Category[]>;
  jobs: Observable<Job[]>;
  data : {
    id : ""
  }
  fruits = [
    { id: 1, name: 'apple' },
    { id: 2, name: 'banana' },
    { id: 3, name: 'cherry' },
  ];
  selfruits = [this.fruits[1]];

  constructor(
    private platForm: Platform,
    private dataCategory: CategoriesService,
    private jobService: JobsService,
    private route: ActivatedRoute,
    private dataService: DataService
     
  ) {
    
    
  }

  ngOnInit() {    
    const id = this.route.snapshot.paramMap.get('id');  
    if (id) {  
      this.jobs = this.jobService.getJobs(id); 
    }  
  }

  onchange($event) {
    this.jobs = this.jobService.getJobs($event.detail.value)
    this.jobs.subscribe(data => {
      console.log(data);
      
    })
  }

  

 



}
