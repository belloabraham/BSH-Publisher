import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDeatilsFormComponent } from './book-deatils-form.component';

describe('BookDeatilsFormComponent', () => {
  let component: BookDeatilsFormComponent;
  let fixture: ComponentFixture<BookDeatilsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookDeatilsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookDeatilsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
