import { TestBed } from '@angular/core/testing';

import { AuthGuardIsAdmin } from './auth-guard-is-admin.service';

describe('AuthGuardIsAdmin', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthGuardIsAdmin = TestBed.get(AuthGuardIsAdmin);
    expect(service).toBeTruthy();
  });
});
