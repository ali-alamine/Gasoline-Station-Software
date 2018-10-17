import { TestBed, inject } from '@angular/core/testing';

import { DebitFormService } from './debit-form.service';

describe('DebitFormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DebitFormService]
    });
  });

  it('should be created', inject([DebitFormService], (service: DebitFormService) => {
    expect(service).toBeTruthy();
  }));
});
