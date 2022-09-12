import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultComponent } from './default/default.component';
import { PeopleFormComponent } from './people-form/people-form.component';
import { PeopleMainComponent } from './people-main/people-main.component';

const routes: Routes = [
  {
    path: '',
    component: PeopleMainComponent,
    children: [
      { path: '', component: DefaultComponent },
      { path: 'new', component: PeopleFormComponent },
      { path: 'edit/:username', component: PeopleFormComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
