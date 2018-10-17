import { TestBed, inject } from '@angular/core/testing';

import { SellLubricantsService } from './sell-lubricants.service';

describe('SellLubricantsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SellLubricantsService]
    });
  });

  it('should be created', inject([SellLubricantsService], (service: SellLubricantsService) => {
    expect(service).toBeTruthy();
  }));
});
