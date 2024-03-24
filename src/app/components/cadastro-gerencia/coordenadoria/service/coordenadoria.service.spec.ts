import { TestBed } from '@angular/core/testing';

import { CoordenadoriaService } from './coordenadoria.service';

describe('CoordenadoriaService', () => {
  let service: CoordenadoriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoordenadoriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
