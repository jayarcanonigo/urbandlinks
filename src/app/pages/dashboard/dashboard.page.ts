import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService } from '../../services/categories.service';
import { Observable } from 'rxjs';
import { Category } from '../../model/model';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  public cagtegories: Observable<Category[]>;

  constructor(private router: Router, private categoriesService: CategoriesService,
              private dataService: DataService
    ) { 

    this.cagtegories = this.categoriesService.getCategories();
  }

  ngOnInit() {
  }

  gotoLocation(){
    this.router.navigate(['home/google-map']);
  }

  gotoEmployees(id){
    let data = {
      id: id
    }  
    this.dataService.setData(2, data);
    this.router.navigateByUrl('/home/servicelist/2');
  }

 
}
