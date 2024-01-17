import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatagoryVideoCardComponent } from './catagory-video-card.component';

describe('CatagoryVideoCardComponent', () => {
  let component: CatagoryVideoCardComponent;
  let fixture: ComponentFixture<CatagoryVideoCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatagoryVideoCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatagoryVideoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
