import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CategorylistPage } from './categorylist.page';

describe('CategorylistPage', () => {
  let component: CategorylistPage;
  let fixture: ComponentFixture<CategorylistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategorylistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CategorylistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
