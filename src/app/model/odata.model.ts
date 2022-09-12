import { People } from './people.model';

export interface Odata {
  '@odata.context': string;
  value: People[];
}
