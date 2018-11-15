import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelContainerComponent } from './fuel-container.component';

describe('FuelContainerComponent', () => {
  let component: FuelContainerComponent;
  let fixture: ComponentFixture<FuelContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
