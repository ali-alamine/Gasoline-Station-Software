import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryTypeComponent } from './history-type.component';

describe('HistoryTypeComponent', () => {
  let component: HistoryTypeComponent;
  let fixture: ComponentFixture<HistoryTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
