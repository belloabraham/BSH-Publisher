import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyBookStoreComponent } from './empty-book-store.component';

describe('EmptyBookStoreComponent', () => {
  let component: EmptyBookStoreComponent;
  let fixture: ComponentFixture<EmptyBookStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmptyBookStoreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyBookStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
