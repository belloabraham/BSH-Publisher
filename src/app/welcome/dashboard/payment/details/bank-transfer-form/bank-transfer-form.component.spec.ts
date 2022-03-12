import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankTransferFormComponent } from './bank-transfer-form.component';

describe('BankTransferFormComponent', () => {
  let component: BankTransferFormComponent;
  let fixture: ComponentFixture<BankTransferFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankTransferFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankTransferFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
