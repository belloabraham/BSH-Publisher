import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankTranferForeignFormComponent } from './bank-tranfer-foreign-form.component';

describe('BankTranferForeignFormComponent', () => {
  let component: BankTranferForeignFormComponent;
  let fixture: ComponentFixture<BankTranferForeignFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankTranferForeignFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankTranferForeignFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
