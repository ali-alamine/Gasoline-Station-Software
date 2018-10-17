import { TestBed, inject } from '@angular/core/testing';

import { WashingCarService } from './washing-car.service';

describe('WashingCarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WashingCarService]
    });
  });

  it('should be created', inject([WashingCarService], (service: WashingCarService) => {
    expect(service).toBeTruthy();
  }));
});
