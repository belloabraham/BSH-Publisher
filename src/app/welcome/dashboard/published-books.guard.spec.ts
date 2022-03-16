import { TestBed } from '@angular/core/testing';

import { PublishedBooksGuard } from './published-books.guard';

describe('PublishedBooksGuard', () => {
  let guard: PublishedBooksGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PublishedBooksGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
