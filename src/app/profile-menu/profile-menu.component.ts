import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";
import {User} from 'server/models/user'
@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.css']
})
export class ProfileMenuComponent implements OnInit {
  public loggedIn: boolean;
  public isAdmin: boolean;

  constructor(
    public auth_api: AuthenticationService,
    public router: Router
  ) {
    this.loggedIn = this.auth_api.loggedIn;
    this.isAdmin = this.auth_api.admin;

  }

  ngOnInit(): void {
    this.loggedIn = this.auth_api.isLogged();
    this.isAdmin = this.auth_api.getAdmin();
    console.log("logged: " + this.loggedIn);
    console.log("Admin " + this.isAdmin)
  }

  logout() {
    console.log('Logout');
    this.auth_api.logout();
    console.log(this.auth_api.loggedIn)
    window.location.reload();
  }

  modify() {
    console.log('Open profile to modify it');
    if (this.auth_api.loggedIn) {
      this.router.navigateByUrl('modify_profile/' + this.auth_api.currentUser._id)
    } else {
      console.log("Can't modify my profile, not logged in");
    }

  }

}

