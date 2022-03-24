import { TestBed } from '@angular/core/testing';

import { PublishedBooksResolver } from './published-books.resolver';

describe('PublishedBooksResolver', () => {
  let resolver: PublishedBooksResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(PublishedBooksResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
