import { TestBed, inject } from '@angular/core/testing';

import { PaymentSupplyService } from './payment-supply.service';

describe('PaymentSupplyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaymentSupplyService]
    });
  });

  it('should be created', inject([PaymentSupplyService], (service: PaymentSupplyService) => {
    expect(service).toBeTruthy();
  }));
});
