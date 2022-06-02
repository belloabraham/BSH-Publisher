import { TestBed } from '@angular/core/testing';

import { EditBookGuard } from './edit-book.guard';

describe('EditBookGuard', () => {
  let guard: EditBookGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EditBookGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
