import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService } from '../../services/categories.service';
import { Observable } from 'rxjs';
import { Category, RequestProvider } from '../../model/model';
import { DataService } from '../../services/data.service';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.page.html',
  styleUrls: ['./tab.page.scss'],
})
export class TabPage implements OnInit {

  public requestList: Observable<RequestProvider[]>;
  public cagtegories: Observable<Category[]>;
  pendingCount: number;
  todoCount: number;
  inProgressCount: number;
  pastCount: number;

  constructor(private router: Router, private categoriesService: CategoriesService,
    private dataService: DataService, private requestService: RequestService
  ) {

    this.requestService.getRequestProviderByUserId('4yIkFf95iR7E76Yx7dFN').subscribe(data => {   
      this.pendingCount = this.requestCount(data, 'Pending');
      this.todoCount = this.requestCount(data, 'To Do');
      this.inProgressCount = this.requestCount(data, 'In Progress');
      this.pastCount = this.requestCount(data, 'Past');
    });
   
    /**
     * Filter array items based on search criteria (query)
     */


    this.cagtegories = this.categoriesService.getCategories();
  }

  requestCount(requestList, status): number {
    return requestList.filter(h => h.status === status).length;
  }

  ngOnInit() {
  }

  gotoLocation() {
    this.router.navigate(['home/google-map']);
  }

  gotoEmployees(id) {
    let data = {
      id: id
    }
    this.dataService.setData(2, data);
    this.router.navigateByUrl('/home/servicelist/2');
  }

  test() {
    console.log('test');

  }



}

