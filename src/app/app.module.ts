import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormBuilder , FormsModule , ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginFormComponent } from './login-form/login-form.component';
import {HttpClientModule} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {AuthenticationService} from "./services/authentication.service";
import { AuthorizationAssignmentFormComponent } from './authorization-assignment-form/authorization-assignment-form.component';
import { ProfileMenuComponent } from './profile-menu/profile-menu.component';
import { AddDoorFormComponent } from './add-door-form/add-door-form.component';
import { ProfileDataFormComponent } from './profile-data-form/profile-data-form.component';
import { ModifyDoorComponent } from './modify-door/modify-door.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ManageDoorsComponent } from './manage-doors/manage-doors.component';
import { ChangePasswordFormComponent } from './change-password-form/change-password-form.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    RegistrationFormComponent,
    DashboardComponent,
    AuthorizationAssignmentFormComponent,
    ProfileMenuComponent,
    AddDoorFormComponent,
    ProfileDataFormComponent,
    ModifyDoorComponent,
    ManageUsersComponent,
    ManageDoorsComponent,
    ChangePasswordFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    FormBuilder,
    AuthenticationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
