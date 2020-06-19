import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../model/model';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.page.html',
  styleUrls: ['./jobs.page.scss'],
})
export class JobsPage implements OnInit {
  public files: Observable<Category[]>;

  constructor( private categoriesService: CategoriesService) { }

  ngOnInit() {
    this.files = this.categoriesService.getCategories();
  }

}
