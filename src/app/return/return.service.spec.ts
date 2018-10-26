import { TestBed, inject } from '@angular/core/testing';

import { ReturnService } from './return.service';

describe('ReturnService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReturnService]
    });
  });

  it('should be created', inject([ReturnService], (service: ReturnService) => {
    expect(service).toBeTruthy();
  }));
});
