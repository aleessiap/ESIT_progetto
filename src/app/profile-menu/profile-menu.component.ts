import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";
import { User } from '../../../server/models/user';
import {HttpErrorResponse} from "@angular/common/http";

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

  }

  ngOnInit(): void {

    let loggedIn = localStorage.getItem('loggedIn');
    if( loggedIn == 'True'){
      this.loggedIn = true;
    }else{
      this.loggedIn = false;
    }
    let admin = localStorage.getItem('admin');
    if( admin == 'true'){
      this.isAdmin = true;
    }else{
      this.isAdmin = false;
    }
    this.logged = localStorage.getItem('currentUser');

  }

  logout() {
    console.log("logout pressed");
    this.auth_api.logout().subscribe(

    );
    this.router.navigateByUrl('login').then(r => window.location.reload());
  }

  name(){
    localStorage.clear();
    this.router.navigateByUrl('login').then(r => window.location.reload());
  }

  modify() {
    this.router.navigateByUrl('modify_profile/' + this.logged).then( );
  }

}

