import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksPendingApprovalComponent } from './books-pending-approval.component';

describe('BooksPendingApprovalComponent', () => {
  let component: BooksPendingApprovalComponent;
  let fixture: ComponentFixture<BooksPendingApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BooksPendingApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BooksPendingApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
