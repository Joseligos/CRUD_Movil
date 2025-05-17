import { TestBed } from '@angular/core/testing';

import { GrupomultimediaService } from './grupomultimedia.service';

describe('GrupomultimediaService', () => {
  let service: GrupomultimediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrupomultimediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
