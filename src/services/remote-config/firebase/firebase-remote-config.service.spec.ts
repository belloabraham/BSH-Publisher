import { TestBed } from '@angular/core/testing';

import { FirebaseRemoteConfigService } from './firebase-remote-config.service';

describe('FirebaseRemoteConfigService', () => {
  let service: FirebaseRemoteConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseRemoteConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
