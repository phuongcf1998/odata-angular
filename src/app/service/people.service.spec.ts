import { TestBed } from '@angular/core/testing';

import { PeopleService } from './people.service';

import { HttpClientModule } from '@angular/common/http';
describe('PeopleService', () => {
  let service: PeopleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(PeopleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
