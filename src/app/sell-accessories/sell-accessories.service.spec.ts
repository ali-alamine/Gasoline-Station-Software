import { TestBed, inject } from '@angular/core/testing';

import { SellAccessoriesService } from './sell-accessories.service';

describe('SellAccessoriesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SellAccessoriesService]
    });
  });

  it('should be created', inject([SellAccessoriesService], (service: SellAccessoriesService) => {
    expect(service).toBeTruthy();
  }));
});
