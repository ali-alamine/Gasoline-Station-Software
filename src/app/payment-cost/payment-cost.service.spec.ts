import { TestBed, inject } from '@angular/core/testing';

import { PaymentCostService } from './payment-cost.service';

describe('PaymentCostService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaymentCostService]
    });
  });

  it('should be created', inject([PaymentCostService], (service: PaymentCostService) => {
    expect(service).toBeTruthy();
  }));
});
