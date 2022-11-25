import { TestBed } from '@angular/core/testing';

import { PaymentRequestResolver } from './payment-request.resolver';

describe('PaymentRequestResolver', () => {
  let resolver: PaymentRequestResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(PaymentRequestResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
