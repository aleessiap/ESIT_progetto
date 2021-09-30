import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {User} from "../../../server/models/user"

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.css']
})

export class ProfileMenuComponent implements OnInit {

  public loggedIn: boolean;
  public isAdmin: boolean;
  public logged: string | null;
  public full_name:string = '';

  constructor(
    public auth_api: AuthenticationService,
    public user_api: UserService,
    public router: Router
  ) {

  }

  ngOnInit(): void {

    //Operations to check if there is someone logged in and if the user is an admin

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

  /**This method is used to logout**/
  logout() {
    console.log("logout pressed");
    this.auth_api.logout().subscribe();
    this.router.navigateByUrl('login').then(r => window.location.reload());
  }

  /**This method is used to go to the dashboard if the user is logged in, or to the login page if the user is not logged in**/
  home(){

    if(this.loggedIn){

      this.router.navigateByUrl('dashboard').then(r => window.location.reload());

    }else{

      this.router.navigateByUrl('login').then(r => window.location.reload());

    }

  }

  /**This method is used to go to the page dedicated to the updating of the user**/
  modify() {
    this.router.navigateByUrl('modify_profile/' + this.logged).then( );
  }

}

