import { TestBed, inject } from '@angular/core/testing';

import { SetPricesService } from './set-prices.service';

describe('SetPricesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SetPricesService]
    });
  });

  it('should be created', inject([SetPricesService], (service: SetPricesService) => {
    expect(service).toBeTruthy();
  }));
});
