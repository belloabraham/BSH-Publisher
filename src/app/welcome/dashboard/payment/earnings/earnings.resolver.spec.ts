import { TestBed } from '@angular/core/testing';

import { EarningsResolver } from './earnings.resolver';

describe('EarningsResolver', () => {
  let resolver: EarningsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(EarningsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
