import { TestBed } from '@angular/core/testing';

import { CollaboratorsResolver } from './collaborators.resolver';

describe('CollaboratorsResolver', () => {
  let resolver: CollaboratorsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(CollaboratorsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
