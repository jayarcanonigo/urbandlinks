import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReasonsPage } from './reasons.page';

describe('ReasonsPage', () => {
  let component: ReasonsPage;
  let fixture: ComponentFixture<ReasonsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReasonsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReasonsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
