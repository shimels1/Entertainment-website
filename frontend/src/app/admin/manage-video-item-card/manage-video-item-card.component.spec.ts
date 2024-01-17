import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageVideoItemCardComponent } from './manage-video-item-card.component';

describe('ManageVideoItemCardComponent', () => {
  let component: ManageVideoItemCardComponent;
  let fixture: ComponentFixture<ManageVideoItemCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageVideoItemCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageVideoItemCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
