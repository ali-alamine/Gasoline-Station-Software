import { TestBed, inject } from '@angular/core/testing';

import { PaymentsReportServicesService } from './payments-report-services.service';

describe('PaymentsReportServicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaymentsReportServicesService]
    });
  });

  it('should be created', inject([PaymentsReportServicesService], (service: PaymentsReportServicesService) => {
    expect(service).toBeTruthy();
  }));
});
