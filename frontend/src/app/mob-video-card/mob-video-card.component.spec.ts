import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobVideoCardComponent } from './mob-video-card.component';

describe('MobVideoCardComponent', () => {
  let component: MobVideoCardComponent;
  let fixture: ComponentFixture<MobVideoCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobVideoCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobVideoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
