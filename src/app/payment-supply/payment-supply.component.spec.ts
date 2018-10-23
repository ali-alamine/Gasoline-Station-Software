import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSupplyComponent } from './payment-supply.component';

describe('PaymentSupplyComponent', () => {
  let component: PaymentSupplyComponent;
  let fixture: ComponentFixture<PaymentSupplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentSupplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSupplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
