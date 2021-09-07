import { Component, OnInit } from '@angular/core';
import {User} from 'server/models/user';
import {UserService} from '../services/user.service'
import {Router} from "@angular/router";
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
    })
  }
  modifyUser(user: User){
    console.log('Click on modify user');
    console.log(user.name)
    this.router.navigateByUrl('/modify_profile/'+user._id)

  }
  deleteUser(user: User){
    console.log('Click delete user');
    console.log(user.name)
    this.api.deleteUser(user._id).subscribe(() => console.log("User deleted"));
    window.location.reload();
  }

  search(user: string) {
    this.api.searchUser(user).subscribe((data: User[]) => {
      this.users = data;
    })
  }

}

