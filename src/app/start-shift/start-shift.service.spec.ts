import { TestBed, inject } from '@angular/core/testing';

import { StartShiftService } from './start-shift.service';

describe('StartShiftService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StartShiftService]
    });
  });

  it('should be created', inject([StartShiftService], (service: StartShiftService) => {
    expect(service).toBeTruthy();
  }));
});
