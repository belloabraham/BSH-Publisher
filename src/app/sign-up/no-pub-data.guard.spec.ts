import { TestBed } from '@angular/core/testing';

import { NoPubDataGuard } from './no-pub-data.guard';

describe('NoPubDataGuard', () => {
  let guard: NoPubDataGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NoPubDataGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
