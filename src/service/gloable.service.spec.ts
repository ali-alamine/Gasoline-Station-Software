import { TestBed, inject } from '@angular/core/testing';

import { GloableService } from './gloable.service';

describe('GloableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GloableService]
    });
  });

  it('should be created', inject([GloableService], (service: GloableService) => {
    expect(service).toBeTruthy();
  }));
});
