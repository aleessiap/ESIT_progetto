import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";
import { User } from '../../../server/models/user';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.css']
})
export class ProfileMenuComponent implements OnInit {
  public loggedIn: boolean;
  public isAdmin: boolean;
  public logged: string | null;
  constructor(
    public auth_api: AuthenticationService,
    public router: Router
  ) {
    this.loggedIn = this.auth_api.loggedIn;
    this.isAdmin = this.auth_api.admin;
  }

  ngOnInit(): void {
    console.log("Profile menu")
    let loggedIn = localStorage.getItem('loggedIn');
    if( loggedIn == 'True'){
      this.loggedIn = true;
    }else{
      this.loggedIn = false;
    }
    let admin = localStorage.getItem('admin');
    if( admin == 'True'){
      this.isAdmin = true;
    }else{
      this.isAdmin = false;
    }
    this.logged = localStorage.getItem('currentUser');
    //this.loggedIn = this.auth_api.isLogged();
    //this.isAdmin = this.auth_api.getAdmin();
    console.log("logged: " + this.loggedIn);
    console.log("id user: " + this.logged);

    console.log("Admin " + this.isAdmin)
  }

  logout() {
    console.log('Logout');
    this.auth_api.logout();
    this.router.navigateByUrl('login').then(r => window.location.reload());

  }
  name(){
    localStorage.clear();
    this.router.navigateByUrl('login').then(r => window.location.reload());
  }
  modify() {
    console.log('Open profile to modify it');
    if (this.loggedIn) {
      this.router.navigateByUrl('modify_profile/' + this.logged).then( );
    } else {
      console.log("Can't modify my profile, not logged in");
    }
  }

}

