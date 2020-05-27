import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ServicelistPage } from './servicelist.page';

describe('ServicelistPage', () => {
  let component: ServicelistPage;
  let fixture: ComponentFixture<ServicelistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicelistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ServicelistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
