import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCollaboratorsDialogComponent } from './add-collaborators-dialog.component';

describe('AddCollaboratorsDialogComponent', () => {
  let component: AddCollaboratorsDialogComponent;
  let fixture: ComponentFixture<AddCollaboratorsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCollaboratorsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCollaboratorsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
