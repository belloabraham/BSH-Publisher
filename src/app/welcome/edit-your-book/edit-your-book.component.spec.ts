import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditYourBookComponent } from './edit-your-book.component';

describe('EditYourBookComponent', () => {
  let component: EditYourBookComponent;
  let fixture: ComponentFixture<EditYourBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditYourBookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditYourBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
