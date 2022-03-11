import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingPublishedComponent } from './pending-published.component';

describe('PendingPublishedComponent', () => {
  let component: PendingPublishedComponent;
  let fixture: ComponentFixture<PendingPublishedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingPublishedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingPublishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
