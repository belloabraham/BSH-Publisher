import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishersPaymentRequestComponent } from './publishers-payment-request.component';

describe('PublishersPaymentRequestComponent', () => {
  let component: PublishersPaymentRequestComponent;
  let fixture: ComponentFixture<PublishersPaymentRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublishersPaymentRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublishersPaymentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
