import { TestBed } from '@angular/core/testing';

import { PubDataResolver } from './pub-data.resolver';

describe('PubDataResolver', () => {
  let resolver: PubDataResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(PubDataResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
