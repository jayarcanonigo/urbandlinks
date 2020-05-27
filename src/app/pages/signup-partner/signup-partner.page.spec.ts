import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SignupPartnerPage } from './signup-partner.page';

describe('SignupPartnerPage', () => {
  let component: SignupPartnerPage;
  let fixture: ComponentFixture<SignupPartnerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupPartnerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupPartnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
