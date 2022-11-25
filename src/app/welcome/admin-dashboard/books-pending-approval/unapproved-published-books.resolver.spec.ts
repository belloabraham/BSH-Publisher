import { TestBed } from '@angular/core/testing';

import { UnapprovedPublishedBooksResolver } from './unapproved-published-books.resolver';

describe('UnapprovedPublishedBooksResolver', () => {
  let resolver: UnapprovedPublishedBooksResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(UnapprovedPublishedBooksResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
