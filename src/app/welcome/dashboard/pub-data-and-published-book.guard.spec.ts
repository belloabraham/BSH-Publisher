import { TestBed } from '@angular/core/testing';

import { PubDataAndPublishedBookGuard } from './pub-data-and-published-book.guard';

describe('PubDataAndPublishedBookGuard', () => {
  let guard: PubDataAndPublishedBookGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PubDataAndPublishedBookGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
