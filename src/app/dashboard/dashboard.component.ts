import { Component, OnInit } from '@angular/core';
import {User} from 'server/models/user'
import {Observable} from "rxjs";
import {AuthenticationService} from "../services/authentication.service";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  title = 'Fetch Employee';
  users : any = [];
  loggedIn: boolean;
  logged : Observable<User>;
  constructor(private api : AuthenticationService){
    this.api.getUsers().subscribe(data => {
      this.users = data;
    })
    console.log(this.api.currentUser);
    if(this.api.loggedIn){
      console.log("dashboard found user "+ this.logged);
      this.logged = this.api.currentUser;
      this.loggedIn = true;
    }else{
      this.loggedIn = false;
    }
  }

  columns = [ "Name", "Surname", "Email", "Password"];

  index = [ "name", "surname", "email", "password"];


  ngOnInit(): void {
    console.log("Dashboard ");

    //this.rs.getUsers();
  }

}
