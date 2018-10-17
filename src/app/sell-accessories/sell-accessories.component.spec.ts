import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellAccessoriesComponent } from './sell-accessories.component';

describe('SellAccessoriesComponent', () => {
  let component: SellAccessoriesComponent;
  let fixture: ComponentFixture<SellAccessoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellAccessoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellAccessoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
