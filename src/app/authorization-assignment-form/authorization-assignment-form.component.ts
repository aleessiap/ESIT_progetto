import {Component, OnInit} from '@angular/core';
import { AuthorizationService } from "../services/authorization.service";
import { DoorService } from "../services/door.service";
import { Door } from "../../../server/models/door";
import { User } from "../../../server/models/user"
import {HttpErrorResponse} from "@angular/common/http";
import {UserService} from "../services/user.service";


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
  loggedIn : string | null;
  admin : string | null;
  unable: boolean;
  add: string;
  constructor(
    private api_door:DoorService,
    private api_auth:AuthorizationService,
    private api_user: UserService
  ) {

  }

  ngOnInit(): void {

    this.unable = false;
    this.loggedIn = localStorage.getItem('loggedIn');
    this.admin = localStorage.getItem('admin');

    this.api_door.getAllDoors().subscribe((data: Door[]) => {
      this.doors = data
    },
      (err: HttpErrorResponse) => {
        console.log("Error in getting the doors");
        console.log(err);
      })

  }

  removeAuth(door_id:string, user_id:string, index:number): void {
    this.unable = false;
    this.api_auth.deleteAuthorizations(door_id, user_id).subscribe(() => {
      let user = this.authorized.splice(index, 1)[0]
      this.not_authorized.push(user)
    },
      (err: HttpErrorResponse) => {
        console.log(err);

      }
    )
  }

  addAuth(door_id:string, user_id:string, index:number) {
    this.unable = false;
    this.api_auth.insertAuthorization(door_id, user_id).subscribe(
      () => {

      let user = this.not_authorized.splice(index, 1)[0]
      this.authorized.push(user);

    },
      (err) => {

        if(err.status == 403 && err.error.found == false){
          this.unable = true;
        }
      })

  }

  loadAuth(door_id:string): void {

    this.api_auth.getAuthorizations(door_id).subscribe((data) => {
      this.authorized = data
    },
      (err: HttpErrorResponse) => {
        console.log("Error in getting the authorized users");
        console.log(err);
      })

    this.api_auth.getNotAuthorized(door_id).subscribe((data) => {
      this.not_authorized = data
    },
      (err: HttpErrorResponse) => {
        console.log("Error in getting the not authorized users");
        console.log(err);
      }
    )
  }

  filterAuthorized(user : string): void{

    this.api_user.searchUser(user).subscribe((data: User[]) => {
      this.authorized = data;
    },
      (err: HttpErrorResponse) => {
        console.log("Error in the searching");
        console.log(err);
      })
  }

  filterUnauthorized(user: string): void{
    this.api_user.searchUser(user).subscribe((data: User[]) => {
      this.not_authorized = data;
    },
      (err: HttpErrorResponse) => {
        console.log("Error in the searching");
        console.log(err);
      })
  }

}
