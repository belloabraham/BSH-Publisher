import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookAssetFormComponent } from './book-asset-form.component';

describe('BookAssetFormComponent', () => {
  let component: BookAssetFormComponent;
  let fixture: ComponentFixture<BookAssetFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookAssetFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookAssetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
