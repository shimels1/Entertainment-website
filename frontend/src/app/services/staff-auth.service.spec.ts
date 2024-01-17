import { TestBed } from '@angular/core/testing';

import { StaffAuthService } from './staff-auth.service';

describe('StaffAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StaffAuthService = TestBed.get(StaffAuthService);
    expect(service).toBeTruthy();
  });
});
