import { TestBed } from '@angular/core/testing';

import { PubDataGuard } from './pub-data.guard';

describe('PubDataGuard', () => {
  let guard: PubDataGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PubDataGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
