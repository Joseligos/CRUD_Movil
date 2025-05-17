import { TestBed } from '@angular/core/testing';

import { MultimediaheroeService } from './multimediaheroe.service';

describe('MultimediaheroeService', () => {
  let service: MultimediaheroeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultimediaheroeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
