import { TestBed } from '@angular/core/testing';

import { NoPublishedBooksGuard } from './no-published-books.guard';

describe('NoPublishedBooksGuard', () => {
  let guard: NoPublishedBooksGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NoPublishedBooksGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
