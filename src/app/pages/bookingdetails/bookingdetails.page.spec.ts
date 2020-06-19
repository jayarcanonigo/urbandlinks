import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BookingdetailsPage } from './bookingdetails.page';

describe('BookingdetailsPage', () => {
  let component: BookingdetailsPage;
  let fixture: ComponentFixture<BookingdetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingdetailsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BookingdetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
