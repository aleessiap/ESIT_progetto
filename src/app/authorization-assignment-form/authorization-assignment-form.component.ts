import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from "../services/authorization.service";
import { DoorService } from "../services/door.service";
import { Door } from "../../../server/models/door";
import { User } from "../../../server/models/user"
import { Observable } from "rxjs";
import {map} from "rxjs/operators";
import {waitForAsync} from "@angular/core/testing";

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

  constructor(private api_door:DoorService, private api_auth:AuthorizationService ) { }

  ngOnInit(): void {

    this.api_door.getAllDoors().subscribe((data: Door[]) => {

      this.doors = data

    })

  }

  removeAuth(door_id:string, user_id:string, index:number): void {

    this.api_auth.deleteAuthorizations(door_id, user_id).subscribe((data) => {

      let user = this.authorized.splice(index, 1)[0]
      this.not_authorized.push(user)

    })

  }

  addAuth(door_id:string, user_id:string, index:number): void {

    this.api_auth.insertAuthorization(door_id, user_id).subscribe((data) => {

      let user = this.not_authorized.splice(index, 1)[0]
      this.authorized.push(user)

    })

  }

  loadAuth(door_id:string): void {

    this.api_auth.getAuthorizations(door_id).subscribe((data => {

      this.authorized = data

    }))


    this.api_auth.getNotAuthorized(door_id).subscribe((data => {

      this.not_authorized = data

    }))

  }

  filterAuthorized(authorized_filter): void{

    console.log(this.authorized_filter)

  }

  filterUnauthorized(not_authorized_filter): void{



  }

}
