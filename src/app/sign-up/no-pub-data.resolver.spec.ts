import { TestBed } from '@angular/core/testing';

import { NoPubDataResolver } from './no-pub-data.resolver';

describe('NoPubDataResolver', () => {
  let resolver: NoPubDataResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(NoPubDataResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
