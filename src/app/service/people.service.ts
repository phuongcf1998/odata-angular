import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';

import { People } from '../model/people.model';
import { Odata } from '../model/odata.model';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  private API_URL: string =
    'https://services.odata.org/TripPinRESTierService/(S(3xrmlq25m2vtmb0cpn03xp2j))/People';

  peoplesChanged = new Subject<string>();

  existingUsernames: string[] = [];

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  checkIfUsernameExists(value: string) {
    return of(this.existingUsernames.some((a) => a === value)).pipe(
      delay(1000)
    );
  }

  getListPeople(): Observable<Odata> {
    return this.http.get<Odata>(this.API_URL, this.httpOptions);
  }

  addNewPeople(people: People): Observable<People> {
    return this.http.post<People>(this.API_URL, people, this.httpOptions);
  }

  getPeopleByUserName(userName: string): Observable<People> {
    return this.http.get<People>(
      `${this.API_URL}('${userName}')`,
      this.httpOptions
    );
  }

  deletePeople(userName: string) {
    return this.http.delete(`${this.API_URL}('${userName}')`, this.httpOptions);
  }

  updatePeople(people: People, userName: string) {
    return this.http.patch(
      `${this.API_URL}('${userName}')`,
      people,
      this.httpOptions
    );
  }

  changePeoplesSubject(msg: string) {
    this.peoplesChanged.next(msg);
  }

  // handleError(error: HttpErrorResponse) {
  //   if (error.status === 0) {
  //     console.error('An error occurred:', error.error);
  //   } else {
  //     console.error(
  //       `Backend returned code ${error.status}, body was: `,
  //       error.error
  //     );
  //   }
  //   return throwError(
  //     () => new Error('Something bad happened; please try again later.')
  //   );
  // }
}
