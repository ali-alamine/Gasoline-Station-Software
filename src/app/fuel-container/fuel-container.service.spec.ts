import { TestBed, inject } from '@angular/core/testing';

import { FuelContainerService } from './fuel-container.service';

describe('FuelContainerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FuelContainerService]
    });
  });

  it('should be created', inject([FuelContainerService], (service: FuelContainerService) => {
    expect(service).toBeTruthy();
  }));
});
