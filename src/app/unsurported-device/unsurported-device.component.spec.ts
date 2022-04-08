import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsurportedDeviceComponent } from './unsurported-device.component';

describe('UnsurportedDeviceComponent', () => {
  let component: UnsurportedDeviceComponent;
  let fixture: ComponentFixture<UnsurportedDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnsurportedDeviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsurportedDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
