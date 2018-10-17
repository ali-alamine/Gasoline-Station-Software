import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellLubricantsComponent } from './sell-lubricants.component';

describe('SellLubricantsComponent', () => {
  let component: SellLubricantsComponent;
  let fixture: ComponentFixture<SellLubricantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellLubricantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellLubricantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
