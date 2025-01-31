import { TestBed } from '@angular/core/testing';

import { AuthhService } from './authh.service';

describe('AuthhService', () => {
  let service: AuthhService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthhService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
