import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from "../services/authorization.service";
import { DoorService } from "../services/door.service";
import { Door } from "../../../server/models/door";

@Component({
  selector: 'app-authorization-assignment-form',
  templateUrl: './authorization-assignment-form.component.html',
  styleUrls: ['./authorization-assignment-form.component.css']
})
export class AuthorizationAssignmentFormComponent implements OnInit {

  doors: string[] = []
  authorized: string[] = []
  not_authorized: string[] = []
  selected: string = ''

  constructor(private api_door:DoorService, private api_auth:AuthorizationService ) { }

  ngOnInit(): void {

    this.doors = ['door1', 'door2', 'door3']
    this.authorized = ['user1', 'user2']
    this.not_authorized = ['user3', 'user4']
    this.selected = this.doors[2]

  }

  removeAuth(user:string): void {

    user = this.authorized.splice(this.authorized.indexOf(user), 1)[0]
    this.not_authorized.push(user);

  }

  addAuth(user:string): void {

    user = this.not_authorized.splice(this.not_authorized.indexOf(user), 1)[0]
    this.authorized.push(user);

  }

  loadAuth(selected:string): void {

    let aux = this.authorized
    this.authorized = this.not_authorized
    this.not_authorized = aux

  }

}
