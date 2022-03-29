import { TestBed } from '@angular/core/testing';

import { IncomingRouteService } from './incoming-route.service';

describe('IncomingRouteService', () => {
  let service: IncomingRouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncomingRouteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
