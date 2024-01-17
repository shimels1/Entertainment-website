import { TestBed } from '@angular/core/testing';

import { AuthGuardUserLogin } from './auth-guardUserLogin.service';

describe('AuthGuardUserLogin', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthGuardUserLogin = TestBed.get(AuthGuardUserLogin);
    expect(service).toBeTruthy();
  });
});
