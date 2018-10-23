import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingDetailsComponent } from './accounting-details.component';

describe('AccountingDetailsComponent', () => {
  let component: AccountingDetailsComponent;
  let fixture: ComponentFixture<AccountingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
