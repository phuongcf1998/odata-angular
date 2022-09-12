import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Odata } from '../model/odata.model';
import { People } from '../model/people.model';
import { PeopleService } from '../service/people.service';

@Component({
  selector: 'app-people-main',
  templateUrl: './people-main.component.html',
  styleUrls: ['./people-main.component.scss'],
})
export class PeopleMainComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  listPeople: People[] = [];
  errorResponse!: HttpErrorResponse;
  peopleChangedMsg!: string;

  constructor(private peopleService: PeopleService) {}

  ngOnInit(): void {
    this.getAllListPeople();
    this.subscription = this.peopleService.peoplesChanged.subscribe(
      (statusData: string) => {
        if (statusData === 'data changed') {
          this.peopleChangedMsg = statusData;
          this.getAllListPeople();
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getAllListPeople() {
    this.peopleService.getListPeople().subscribe({
      next: (data: Odata) => {
        this.listPeople = data.value.filter((item: People) => {
          return !item['@odata.type'];
        });
        // this.listPeople = data.value;
        let userNameList = this.listPeople.map(
          (element: People) => element.UserName
        );
        this.peopleService.existingUsernames = userNameList;
      },
      error: (err: HttpErrorResponse) => {
        this.errorResponse = err;
      },
      complete: () => console.info('Get list people complete'),
    });
  }
}
