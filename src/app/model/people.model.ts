import { AddressInfo } from './address.model';

export interface People {
  '@odata.type': string;
  UserName: string;
  FirstName: string;
  LastName: string;
  MiddleName: string;
  Emails: string[];
  AddressInfo: AddressInfo[];
}
