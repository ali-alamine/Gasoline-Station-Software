import { TestBed, inject } from '@angular/core/testing';

import { ReportOptionsServicesService } from './report-options-services.service';

describe('ReportOptionsServicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReportOptionsServicesService]
    });
  });

  it('should be created', inject([ReportOptionsServicesService], (service: ReportOptionsServicesService) => {
    expect(service).toBeTruthy();
  }));
});
