import { Component, OnInit } from '@angular/core';
import {User} from 'server/models/user'
import {Door} from 'server/models/door'
import {Access} from 'server/models/door'
import {AuthenticationService} from "../services/authentication.service";
import {DoorService} from "../services/door.service";
import {AccessService} from "../services/access.service";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  doors: Door[] = [];
  access = {}

  loggedIn : string | null;
  admin : string | null;

  constructor(private api_door: DoorService,
              private api_auth: AuthenticationService,
              private api_accs: AccessService,
              private api_user: UserService
  ){
  }


  ngOnInit(): void {
    this.loggedIn = localStorage.getItem('loggedIn');
    this.admin = localStorage.getItem('admin');

    this.api_door.getAllDoors().subscribe((data: Door[]) => {

      this.doors = data

      for (const door of this.doors) {

        this.api_accs.getAccessByDoorId(door._id).subscribe((data:Access[]) => {
          data.forEach((value) => {
            value['time'] = new Date(value['createdAt']).toLocaleTimeString()
            value['date'] = new Date(value['createdAt']).toLocaleDateString()

            this.api_user.getUser(value['user_id']).subscribe((data:User) => {

              value['username'] = data.username

            })

          })
          this.access[door._id] = data
        });

      }
    })

  }

  search(door: string) {
    this.api_door.searchDoor(door).subscribe((data: Door[]) => {
      this.doors = data;
    })

    for (const door of this.doors) {

      this.api_accs.getAccessByDoorId(door._id).subscribe((data:Access[]) => {
        data.forEach((value) => {
          value['time'] = new Date(value['createdAt']).toLocaleTimeString()
          value['date'] = new Date(value['createdAt']).toLocaleDateString()
        })
        this.access[door._id] = data
      });

    }
  }

}
