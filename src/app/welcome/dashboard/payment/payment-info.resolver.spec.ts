import { TestBed } from '@angular/core/testing';

import { PaymentInfoResolver } from './payment-info.resolver';

describe('PaymentInfoResolver', () => {
  let resolver: PaymentInfoResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(PaymentInfoResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
