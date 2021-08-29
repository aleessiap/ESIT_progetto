import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginFormComponent } from './login-form/login-form.component';
import {RegistrationFormComponent} from "./registration-form/registration-form.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {AuthorizationAssignmentFormComponent} from "./authorization-assignment-form/authorization-assignment-form.component";
import {AddDoorFormComponent} from "./add-door-form/add-door-form.component";
import {ProfileDataFormComponent} from "./profile-data-form/profile-data-form.component";
import {ModifyDoorComponent} from "./modify-door/modify-door.component";

const routes: Routes = [
  {path:'',  redirectTo: '/login', pathMatch:'full'},
  {path:'login', component:LoginFormComponent},
  {path:'registration', component: RegistrationFormComponent},
  {path:'home', component: DashboardComponent},
  {path:'authorization', component: AuthorizationAssignmentFormComponent},
  {path: 'insert_door', component:AddDoorFormComponent},
  {path: 'modify_profile', component: ProfileDataFormComponent},
  {path: 'modify_door/:name', component: ModifyDoorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
