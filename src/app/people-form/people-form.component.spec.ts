import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PeopleFormComponent } from './people-form.component';
import { RouterTestingModule } from '@angular/router/testing';

import { FormBuilder, FormsModule } from '@angular/forms';

import { PeopleService } from '../service/people.service';
import { Observable, of, throwError } from 'rxjs';

import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { ActivatedRoute, Router } from '@angular/router';

describe('PeopleFormComponent', () => {
  let component: PeopleFormComponent;
  let fixture: ComponentFixture<PeopleFormComponent>;
  let peopleServiceMock: {
    getPeopleByUserName: jest.Mock;
    updatePeople: jest.Mock;
    addNewPeople: jest.Mock;
    deletePeople: jest.Mock;
  };
  let router: Router;

  // let routerMock: {
  //   navigateByUrl: jest.Mock;
  // };
  let activatedRouteMock: { params: Observable<Object> };

  const expectPeople = {
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
  };

  beforeEach(async () => {
    peopleServiceMock = {
      getPeopleByUserName: jest.fn(() => of({})),
      updatePeople: jest.fn(() => of({})),
      addNewPeople: jest.fn(() => of({})),
      deletePeople: jest.fn(() => of({})),
    };

    activatedRouteMock = {
      params: of({
        username: 'russellwhyte',
      }),
    };

    // routerMock = {
    //   navigateByUrl: jest.fn(() => Promise<true>),
    // };

    await TestBed.configureTestingModule({
      declarations: [PeopleFormComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        ButtonModule,
        ConfirmPopupModule,
        ToastModule,
      ],
      providers: [
        { provide: PeopleService, useValue: peopleServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        // { provide: Router, useValue: routerMock },

        FormBuilder,
        ConfirmationService,
        MessageService,
      ],
    });
  });

  const buildComponent = () => {
    TestBed.compileComponents();
    fixture = TestBed.createComponent(PeopleFormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    router.initialNavigation();
  };

  it('should create', () => {
    buildComponent();
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should get people detail success when have username', () => {
    buildComponent();
    peopleServiceMock.getPeopleByUserName.mockImplementation(() =>
      of(expectPeople)
    );
    component.ngOnInit();

    expect(component.people).toEqual(expectPeople);
  });

  it('should define error case when get detail people', () => {
    buildComponent();
    peopleServiceMock.getPeopleByUserName.mockImplementation(() =>
      throwError(
        () =>
          new HttpErrorResponse({
            status: 404,
          })
      )
    );
    jest.spyOn(console, 'error');

    component.ngOnInit();

    expect(console.error).toHaveBeenCalled();
  });

  it('should build new form when does  not have param ', () => {
    activatedRouteMock = {
      params: of({}),
    }; //Arrange

    TestBed.overrideProvider(ActivatedRoute, { useValue: activatedRouteMock }); //Arrange

    buildComponent();

    component.ngOnInit();

    expect(component.editMode).toEqual(false); // edit mode = false mean this is add new people
  });

  it('should add new people when edit mode = false', () => {
    activatedRouteMock = {
      params: of({}),
    }; //Arrange

    TestBed.overrideProvider(ActivatedRoute, { useValue: activatedRouteMock }); //Arrange

    buildComponent();

    peopleServiceMock.addNewPeople.mockImplementation(() => of(expectPeople));

    jest.spyOn(console, 'log');

    component.ngOnInit();
    component.onSubmit();
    expect(console.log).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalled();
  });

  it('should define error case add new people when edit mode = false', () => {
    activatedRouteMock = {
      params: of({}),
    }; //Arrange

    TestBed.overrideProvider(ActivatedRoute, { useValue: activatedRouteMock }); //Arrange

    buildComponent();

    peopleServiceMock.addNewPeople.mockImplementation(() =>
      throwError(
        () =>
          new HttpErrorResponse({
            status: 404,
          })
      )
    );

    jest.spyOn(console, 'error');

    component.ngOnInit();
    component.onSubmit();

    expect(console.error).toHaveBeenCalled();
  });

  it('should push new email to email array when add new email', () => {
    activatedRouteMock = {
      params: of({}),
    }; //Arrange

    TestBed.overrideProvider(ActivatedRoute, { useValue: activatedRouteMock }); //Arrange

    buildComponent();

    component.ngOnInit();
    jest.spyOn(component.emails, 'push');

    component.addEmails();

    expect(component.emails.push).toHaveBeenCalled();
  });
});
