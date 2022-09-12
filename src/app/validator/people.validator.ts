import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PeopleService } from '../service/people.service';
//   import { UserService } from './user.service';

export class PeopleValidator {
  static createUserNameValidator(
    peopleService: PeopleService
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return peopleService
        .checkIfUsernameExists(control.value)
        .pipe(
          map((result: boolean) =>
            result ? { usernameAlreadyExists: true } : null
          )
        );
    };
  }

  static  createEmailDuplicateValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
        let isDuplicate = control.value.some((item: string, index: number) => {
          return control.value.indexOf(item) != index;
        });
        return isDuplicate ? { errorEmail: 'Email must be unique' } : null;
      };

  // static createEmailDuplicateValidator(): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     console.log(control.value);

  //     // let formArrayMailValue = control.value.map((item: { mail: string }) => {
  //     //   return item.mail;
  //     // });
  //     let isDuplicate = control.value.some((item: string, index: number) => {
  //       return control.value.indexOf(item) != index;
  //     });
  //     return isDuplicate ? { errorEmail: 'Email must be unique' } : null;
  //   };
  // }
}
