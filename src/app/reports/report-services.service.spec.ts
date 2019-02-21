import { TestBed, inject } from '@angular/core/testing';

import { ReportServicesService } from './report-services.service';

describe('ReportServicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReportServicesService]
    });
  });

  it('should be created', inject([ReportServicesService], (service: ReportServicesService) => {
    expect(service).toBeTruthy();
  }));
});
