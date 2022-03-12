import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkrillFormComponent } from './skrill-form.component';

describe('SkrillFormComponent', () => {
  let component: SkrillFormComponent;
  let fixture: ComponentFixture<SkrillFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkrillFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkrillFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
