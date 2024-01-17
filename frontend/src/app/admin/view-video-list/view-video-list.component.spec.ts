import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVideoListComponent } from './view-video-list.component';

describe('ViewVideoListComponent', () => {
  let component: ViewVideoListComponent;
  let fixture: ComponentFixture<ViewVideoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewVideoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewVideoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
