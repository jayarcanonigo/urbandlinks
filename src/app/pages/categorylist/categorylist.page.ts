import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { Category } from '../../model/model';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-categorylist',
  templateUrl: './categorylist.page.html',
  styleUrls: ['./categorylist.page.scss'],
})
export class CategorylistPage implements OnInit {
  public files: Observable<Category[]>;
  constructor(private dataProvider: CategoriesService) {
    this.files = this.dataProvider.getCategories();
   }

  ngOnInit() {
  }

}
