import { Component, OnInit } from '@angular/core';
import {User} from 'server/models/user'
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
  logged : User;
  constructor(private api : AuthenticationService){
    this.api.getUsers().subscribe(data => {
      this.users = data;
    })

    if(this.api.loggedIn){
      console.log('------------')
      console.log('Dashboard: ');
      console.log("found user "+ this.logged);
      this.logged = this.api.getCurrentUser();
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
