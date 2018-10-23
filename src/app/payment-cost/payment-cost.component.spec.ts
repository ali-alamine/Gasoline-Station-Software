import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCostComponent } from './payment-cost.component';

describe('PaymentCostComponent', () => {
  let component: PaymentCostComponent;
  let fixture: ComponentFixture<PaymentCostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentCostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
