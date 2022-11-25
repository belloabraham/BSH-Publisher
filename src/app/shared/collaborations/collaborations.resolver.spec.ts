import { TestBed } from '@angular/core/testing';

import { CollaborationsResolver } from './collaborations.resolver';

describe('CollaborationsResolver', () => {
  let resolver: CollaborationsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(CollaborationsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
