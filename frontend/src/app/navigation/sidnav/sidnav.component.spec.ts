import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidnavComponent } from './sidnav.component';

describe('SidnavComponent', () => {
  let component: SidnavComponent;
  let fixture: ComponentFixture<SidnavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidnavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
