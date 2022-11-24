import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublisherCollaborationsComponent } from './publisher-collaborations.component';

describe('PublisherCollaborationsComponent', () => {
  let component: PublisherCollaborationsComponent;
  let fixture: ComponentFixture<PublisherCollaborationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublisherCollaborationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublisherCollaborationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
