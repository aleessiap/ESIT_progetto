import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from "../services/authorization.service";
import { DoorService } from "../services/door.service";
import { Door } from "../../../server/models/door";
import { User } from "../../../server/models/user"
import { Observable } from "rxjs";
import {map} from "rxjs/operators";
import {waitForAsync} from "@angular/core/testing";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-authorization-assignment-form',
  templateUrl: './authorization-assignment-form.component.html',
  styleUrls: ['./authorization-assignment-form.component.css']
})
export class AuthorizationAssignmentFormComponent implements OnInit {

  pins = {}
  doors: Door[] = []
  authorized: User[] = []
  not_authorized: User[] = []
  selected: string = ''

  not_authorized_filter: string = '';
  authorized_filter: string = '';
  loggedIn : string | null;
  admin : string | null;

  constructor(
    private api_door:DoorService,
    private api_auth:AuthorizationService
  ) {

  }

  ngOnInit(): void {

    this.loggedIn = localStorage.getItem('loggedIn');
    this.admin = localStorage.getItem('admin');

    this.api_door.getAllDoors().subscribe((data: Door[]) => {
      this.doors = data
    }),
      (err: HttpErrorResponse) => {
        console.log("Error in getting the doors");
        alert("Error in getting the doors");
      }

  }

  removeAuth(door_id:string, user_id:string, index:number): void {

    this.api_auth.deleteAuthorizations(door_id, user_id).subscribe((data) => {
      let user = this.authorized.splice(index, 1)[0]
      this.not_authorized.push(user)
    }),
      (err: HttpErrorResponse) => {
        console.log("Error in the deletion of the authorization");
        alert("Error in the deletion of the authorization");
      }

  }

  addAuth(door_id:string, user_id:string, index:number): void {

    this.api_auth.insertAuthorization(door_id, user_id).subscribe((data) => {
      let user = this.not_authorized.splice(index, 1)[0]
      this.authorized.push(user)
    }),
      (err: HttpErrorResponse) => {
        console.log("Error in adding an authorization");
        alert("Error in adding an authorization");
      }

  }

  loadAuth(door_id:string): void {

    this.api_auth.getAuthorizations(door_id).subscribe((data => {
      this.authorized = data
    })),
      (err: HttpErrorResponse) => {
        console.log("Error in getting the authorized users");
        alert("Error in getting the authorized users");
      }

    this.api_auth.getNotAuthorized(door_id).subscribe((data => {
      this.not_authorized = data
    })),
      (err: HttpErrorResponse) => {
        console.log("Error in getting the not authorized users");
        alert("Error in getting the not authorized users");
      }

  }

  filterAuthorized(authorized_filter): void{
    console.log(this.authorized_filter)
  }

  filterUnauthorized(not_authorized_filter): void{

  }

}
