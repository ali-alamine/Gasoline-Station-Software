import { TestBed, inject } from '@angular/core/testing';

import { CountersService } from './counters.service';

describe('CountersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CountersService]
    });
  });

  it('should be created', inject([CountersService], (service: CountersService) => {
    expect(service).toBeTruthy();
  }));
});
