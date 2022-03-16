import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishYourBookComponent } from './publish-your-book.component';

describe('PublishYourBookComponent', () => {
  let component: PublishYourBookComponent;
  let fixture: ComponentFixture<PublishYourBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublishYourBookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishYourBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
