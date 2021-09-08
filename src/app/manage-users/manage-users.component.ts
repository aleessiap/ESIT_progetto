import { Component, OnInit } from '@angular/core';
import {User} from 'server/models/user';
import {UserService} from '../services/user.service'
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  users: User[] = [];
  loggedIn : string | null;
  admin : string | null;

  constructor(private api:UserService,
              private router: Router
            )
  { }

  ngOnInit(): void {
    this.loggedIn = localStorage.getItem('loggedIn');
    this.admin = localStorage.getItem('admin');

    this.api.getUsers().subscribe((data:User[]) =>{
      this.users = data
    }),
      (err: HttpErrorResponse) => {
        console.log("Error in getting the users");
        alert("Error in getting the users");
      }
  }

  modifyUser(user: User){

    this.router.navigateByUrl('/modify_profile/'+user._id)

  }

  deleteUser(user: User){

    this.api.deleteUser(user._id).subscribe(
      () => console.log("User deleted")),
      (err: HttpErrorResponse) => {
        console.log("Error in the deletion of the user");
        alert("Error in the deletion of the user");
      };
    window.location.reload();
  }

  search(user: string) {

    this.api.searchUser(user).subscribe((data: User[]) => {
      this.users = data;
    }),
      (err: HttpErrorResponse) => {
        console.log("Error in searching users");
        alert("Error in searching users");
      }

  }

}

