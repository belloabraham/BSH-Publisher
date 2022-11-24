import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorCollaborationsComponent } from './collaborator-collaborations.component';

describe('CollaboratorCollaborationsComponent', () => {
  let component: CollaboratorCollaborationsComponent;
  let fixture: ComponentFixture<CollaboratorCollaborationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollaboratorCollaborationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollaboratorCollaborationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
