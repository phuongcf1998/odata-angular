import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { Subject, Subscription } from 'rxjs';
import { PeopleValidator } from '../validator/people.validator';
import { ConfirmationService, MessageService } from 'primeng/api';

import { ActivatedRoute, Router } from '@angular/router';
import { People } from '../model/people.model';
import { PeopleService } from '../service/people.service';
import { AddressInfo } from '../model/address.model';

@Component({
  selector: 'app-people-form',
  templateUrl: './people-form.component.html',
  styleUrls: ['./people-form.component.scss'],
})
export class PeopleFormComponent implements OnInit {
  peopleForm!: FormGroup;
  editMode: boolean = false;
  people!: People;
  peoplesChanged = new Subject<string>();
  userName!: string;
  paramSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private peopleService: PeopleService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.paramSubscription = this.activatedRoute.params.subscribe((params) => {
      if (params['username'] !== undefined) {
        this.userName = params['username'];
        this.peopleService.getPeopleByUserName(params['username']).subscribe({
          next: (people: People) => {
            this.people = people;
            this.peopleForm = this.fb.group({
              UserName: [this.people.UserName],
              FirstName: [this.people.FirstName, [Validators.required]],
              LastName: [
                this.people.LastName,
                [Validators.required, Validators.maxLength(26)],
              ],
              MiddleName: [this.people.MiddleName],
              Emails: this.fb.array(
                [],
                PeopleValidator.createEmailDuplicateValidator
              ),
              AddressInfo: this.fb.array([]),
            });
            this.pushedItemsFormArray();
          },
          error: (e) => console.error(e),
          complete: () => console.info('Get detail people complete'),
        });
        this.editMode = true;
      } else {
        this.peopleForm = this.fb.group({
          UserName: [
            '',
            Validators.required,
            PeopleValidator.createUserNameValidator(this.peopleService),
          ],
          FirstName: ['', Validators.required],
          LastName: ['', [Validators.required, Validators.maxLength(26)]],
          MiddleName: '',
          Emails: this.fb.array(
            [this.newEmail()],
            PeopleValidator.createEmailDuplicateValidator
          ),
          AddressInfo: this.fb.array([this.newAddress()]),
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.editMode) {
      this.peopleService
        .updatePeople({ ...this.peopleForm.value }, this.userName)
        .subscribe({
          next: (v) => {
            console.log(v);
            this.peopleService.changePeoplesSubject('data changed');
            this.router.navigateByUrl('/');
          },
          error: (e) => console.error(e),
          complete: () => console.info('Patch complete'),
        });
    } else {
      this.peopleService
        .addNewPeople({
          ...this.peopleForm.value,
        })
        .subscribe({
          next: (v) => {
            console.log(v);
            this.peopleService.changePeoplesSubject('data changed');
            this.router.navigateByUrl('/');
          },
          error: (e) => console.error(e),
          complete: () => console.info('Post complete'),
        });
    }
  }

  onDeletePeople(event: Event, userName: string): void {
    this.confirmationService.confirm({
      target: event?.target!,
      message: `Are you sure delete ${userName} ?`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deletePeople(userName);
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'You have accepted',
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
        });
      },
    });
  }

  buildAddressField(address: AddressInfo): FormGroup {
    return this.fb.group({
      Address: address.Address,
      City: this.fb.group({
        Name: address.City.Name,
        CountryRegion: address.City.CountryRegion,
        Region: address.City.Region,
      }),
    });
  }

  buildEmailField(email: string): FormControl {
    return this.fb.control(email, [
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
    ]);
  }

  pushedItemsFormArray() {
    this.people?.AddressInfo!.forEach((address) => {
      this.addresses.push(this.buildAddressField(address));
    });
    this.people?.Emails!.forEach((email) => {
      this.emails.push(this.buildEmailField(email));
    });
  }

  get emails(): FormArray {
    return this.peopleForm.get('Emails') as FormArray;
  }

  get addresses(): FormArray {
    return this.peopleForm.get('AddressInfo') as FormArray;
  }

  newEmail(): FormControl {
    return this.fb.control(
      '',
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    );
  }

  newAddress(): FormGroup {
    return this.fb.group({
      Address: '',
      City: this.fb.group({
        Name: '',
        CountryRegion: '',
        Region: '',
      }),
    });
  }

  addEmails() {
    this.emails.push(this.newEmail());
  }

  addAddress() {
    this.addresses.push(this.newAddress());
  }

  removeEmail(index: number) {
    this.emails.removeAt(index);
  }

  removeAddress(index: number) {
    this.addresses.removeAt(index);
  }

  deletePeople(userName: string) {
    this.peopleService.deletePeople(userName).subscribe({
      next: (v) => {
        console.log(v);
        this.peopleService.changePeoplesSubject('data changed');
        this.router.navigateByUrl('/');
      },
      error: (e) => console.error(e),
      complete: () => console.info('Delete complete'),
    });
  }
}
