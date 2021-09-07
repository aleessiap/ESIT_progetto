import { Component, OnInit } from '@angular/core';
import {User} from 'server/models/user'
import {Door} from 'server/models/door'
import {AuthenticationService} from "../services/authentication.service";
import {DoorService} from "../services/door.service";
import {AccessService} from "../services/access.service";
import {UserService} from "../services/user.service";
import {ProfileMenuComponent} from "../profile-menu/profile-menu.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  users : any = [];
  doors: Door[] = [];
  access = {}
  loggedIn: boolean;
  logged : User;
  constructor(private api_door: DoorService,
              private api_auth : AuthenticationService,
              private api_accs: AccessService,
              private api_user: UserService){
  }


  ngOnInit(): void {

    this.api_door.getAllDoors().subscribe((data: Door[]) => {

      this.doors = data

      for (const door of this.doors) {

        this.access[door._id] = this.api_accs.getAccessByDoorId(door._id);

      }

    })

    this.api_user.getUsers().subscribe(data => {

      this.users = data;
      console.log(data);

    })

    if(this.api_auth.loggedIn){
      this.logged = this.api_auth.currentUser;

      console.log('------------')
      console.log('Dashboard: ');

      console.log("found user "+ this.logged.name);
      this.loggedIn = true;
    }else{
      this.loggedIn = false;
    }

  }

  search(door: string) {
    this.api_door.searchDoor(door).subscribe((data: Door[]) => {
      this.doors = data;
    })
    for (const door of this.doors) {

      this.access[door._id] = this.api_accs.getAccessByDoorId(door._id);

    }
  }

}
