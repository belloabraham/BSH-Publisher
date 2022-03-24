import { TestBed } from '@angular/core/testing';

import { NoPublisherDataGuard } from './no-publisher-data.guard';

describe('NoPublisherDataGuard', () => {
  let guard: NoPublisherDataGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NoPublisherDataGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
