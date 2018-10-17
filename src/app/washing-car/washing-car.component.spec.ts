import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WashingCarComponent } from './washing-car.component';

describe('WashingCarComponent', () => {
  let component: WashingCarComponent;
  let fixture: ComponentFixture<WashingCarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WashingCarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WashingCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
