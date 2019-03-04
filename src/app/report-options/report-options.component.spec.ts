import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportOptionsComponent } from './report-options.component';

describe('ReportOptionsComponent', () => {
  let component: ReportOptionsComponent;
  let fixture: ComponentFixture<ReportOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
