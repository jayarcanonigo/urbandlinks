import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StepperPartnerPage } from './stepper-partner.page';

describe('StepperPartnerPage', () => {
  let component: StepperPartnerPage;
  let fixture: ComponentFixture<StepperPartnerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepperPartnerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StepperPartnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
