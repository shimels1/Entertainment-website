import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NextPlayVideoCardComponent } from './next-play-video-card.component';

describe('NextPlayVideoCardComponent', () => {
  let component: NextPlayVideoCardComponent;
  let fixture: ComponentFixture<NextPlayVideoCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NextPlayVideoCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NextPlayVideoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
