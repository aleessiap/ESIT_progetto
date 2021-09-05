import { Component, OnInit } from '@angular/core';
import {User} from 'server/models/user';
import {UserService} from "../services/user.service";
@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  users: User[] = [];
  constructor(private api:UserService) { }

  ngOnInit(): void {
    this.api.getAllUsers().subscribe((data:User[]) =>{
      this.users = data
    })
  }

}
