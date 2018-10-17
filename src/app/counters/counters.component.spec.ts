import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountersComponent } from './counters.component';

describe('CountersComponent', () => {
  let component: CountersComponent;
  let fixture: ComponentFixture<CountersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
