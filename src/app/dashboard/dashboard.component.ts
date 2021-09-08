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
  users : any = [];
  doors: Door[] = [];
  access = {}
  loggedIn : string | null;
  admin : string | null;
  logged : User;
  constructor(private api_door: DoorService,
              private api_auth : AuthenticationService,
              private api_accs: AccessService,
              private api_user: UserService){
  }


  ngOnInit(): void {
    this.loggedIn = localStorage.getItem('loggedIn');
    this.admin = localStorage.getItem('admin');
    console.log("Admin: " + this.admin);
    console.log("LoggedIn: "+ this.loggedIn);
    this.api_door.getAllDoors().subscribe((data: Door[]) => {

      this.doors = data

      for (const door of this.doors) {

        this.api_accs.getAccessByDoorId(door._id).subscribe((data:Access[]) => {

          data.forEach((value) => {

            value['time'] = new Date(value['createdAt']).toLocaleTimeString()
            value['date'] = new Date(value['createdAt']).toLocaleDateString()

          })

          this.access[door._id] = data

        });

      }

    })

    this.api_user.getUsers().subscribe(data => {

      this.users = data;
      console.log(data);

    })

    if(this.loggedIn){
      this.logged = this.api_auth.currentUser;

      console.log('------------')
      console.log('Dashboard: ');

      console.log("found user "+ this.logged.name);
      this.loggedIn = 'True';
    }else{
      this.loggedIn = 'False';
    }

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
