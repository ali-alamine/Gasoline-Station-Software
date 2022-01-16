import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeznaComponent } from './hezna.component';

describe('HeznaComponent', () => {
  let component: HeznaComponent;
  let fixture: ComponentFixture<HeznaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeznaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeznaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
