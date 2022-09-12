import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { of, Subject, throwError } from 'rxjs';
import { PeopleItemComponent } from '../people-item/people-item.component';

import { PeopleService } from '../service/people.service';

import { PeopleMainComponent } from './people-main.component';

describe('PeopleMainComponent', () => {
  let component: PeopleMainComponent;
  let fixture: ComponentFixture<PeopleMainComponent>;
  let peopleServiceMock: {
    getListPeople: jest.Mock;
    peoplesChanged: Subject<string>;
  };

  const odata = {
    '@odata.context':
      'https://services.odata.org/TripPinRESTierService/(S(3xrmlq25m2vtmb0cpn03xp2j))/$metadata#People',
    value: [
      {
        UserName: 'russellwhyte',
        FirstName: 'Russell',
        LastName: 'Whyte',
        MiddleName: null,
        Gender: 'Male',
        Age: null,
        Emails: ['Russell@example.com', 'Russell@contoso.com'],
        FavoriteFeature: 'Feature1',
        Features: ['Feature1', 'Feature2'],
        AddressInfo: [
          {
            Address: '187 Suffolk Ln.',
            City: {
              Name: 'Boise',
              CountryRegion: 'United States',
              Region: 'ID',
            },
          },
        ],
        HomeAddress: null,
      },
      {
        UserName: 'scottketchum',
        FirstName: 'Scott',
        LastName: 'Ketchum',
        MiddleName: null,
        Gender: 'Male',
        Age: null,
        Emails: ['Scott@example.com'],
        FavoriteFeature: 'Feature1',
        Features: [],
        AddressInfo: [
          {
            Address: '2817 Milton Dr.',
            City: {
              Name: 'Albuquerque',
              CountryRegion: 'United States',
              Region: 'NM',
            },
          },
        ],
        HomeAddress: null,
      },
    ],
  };

  beforeEach(async () => {
    peopleServiceMock = {
      getListPeople: jest.fn(() => of({})),
      peoplesChanged: new Subject<string>(),
    };
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ButtonModule,
        ConfirmPopupModule,
        ToastModule,
        RouterTestingModule,
      ],
      declarations: [PeopleMainComponent, PeopleItemComponent],
      providers: [{ provide: PeopleService, useValue: peopleServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get list success when onInit', () => {
    peopleServiceMock.getListPeople.mockImplementation(() => of(odata));

    component.getAllListPeople();

    // expect(component.listPeople.map((element) => element.UserName)).toEqual(
    //   odata.value.map((element) => element.UserName)
    // );
    expect(odata.value).toEqual(component.listPeople);
  });

  it('should get list success when onInit', () => {
    peopleServiceMock.getListPeople.mockImplementation(() =>
      throwError(() => new HttpErrorResponse({ status: 404 }))
    );

    component.getAllListPeople();

    expect(component.errorResponse.status).toEqual(404);
  });

  it('should subscribe subject from people service', () => {
    peopleServiceMock.peoplesChanged.next('data changed');
    component.ngOnInit();

    expect(component.peopleChangedMsg).toEqual('data changed');
  });
});
