import { Component, OnInit } from '@angular/core';
import {User} from 'server/models/user';
import {AuthenticationService} from '../services/authentication.service'
import {Router} from "@angular/router";
@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  users: User[] = [];

  constructor(private api:AuthenticationService,
              private router: Router
            )
  { }

  ngOnInit(): void {
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

