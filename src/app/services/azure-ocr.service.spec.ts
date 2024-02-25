import { TestBed } from '@angular/core/testing';

import { AzureOcrService } from './azure-ocr.service';

describe('AzureOcrService', () => {
  let service: AzureOcrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AzureOcrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
