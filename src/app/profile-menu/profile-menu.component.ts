import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../services/authentication.service";

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.css']
})
export class ProfileMenuComponent implements OnInit {

  constructor(
    private api: AuthenticationService,
  ) { }
  loggedIn = this.api.loggedIn;
  isAdmin = this.api.admin;
  ngOnInit(): void {
    console.log("Menu ");
  }

  logout(){
    console.log('Logout');
    this.api.logout();
    console.log(this.api.loggedIn)
  }

  modify_profile(data){
    console.log('Open profile to modify it');
    this.api.modifyUser(data);
  }
}
