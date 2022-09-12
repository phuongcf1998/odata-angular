import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { PeopleFormComponent } from './people-form/people-form.component';
import { DefaultComponent } from './default/default.component';
import { PeopleMainComponent } from './people-main/people-main.component';
import { PeopleItemComponent } from './people-item/people-item.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PeopleFormComponent,
    DefaultComponent,
    PeopleMainComponent,
    PeopleItemComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ButtonModule,
    ConfirmPopupModule,
    ToastModule,
  ],
  providers: [ConfirmationService, MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
