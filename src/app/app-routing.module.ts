import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginFormComponent } from './login-form/login-form.component';
import {RegistrationFormComponent} from "./registration-form/registration-form.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {AuthorizationAssignmentFormComponent} from "./authorization-assignment-form/authorization-assignment-form.component";

const routes: Routes = [
  {path:'',  redirectTo: '/login', pathMatch:'full'},
  {path:'login', component:LoginFormComponent},
  {path:'registration', component: RegistrationFormComponent},
  {path:'home', component: DashboardComponent},
  {path:'authorization', component: AuthorizationAssignmentFormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
