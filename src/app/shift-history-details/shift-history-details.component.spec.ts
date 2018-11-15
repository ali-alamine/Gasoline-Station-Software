import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftHistoryDetailsComponent } from './shift-history-details.component';

describe('ShiftHistoryDetailsComponent', () => {
  let component: ShiftHistoryDetailsComponent;
  let fixture: ComponentFixture<ShiftHistoryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftHistoryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftHistoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
