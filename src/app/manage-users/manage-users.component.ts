import {Component, OnInit} from '@angular/core';
import {User} from 'server/models/user';
import {UserService} from '../services/user.service'
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})

export class ManageUsersComponent implements OnInit {

  users: User[] = [];

  loggedIn : string | null;
  admin : string | null;

  constructor(
    private api:UserService,
    private router: Router,
    private modalService: NgbModal
  )
  {

  }

  ngOnInit(): void {

    this.loggedIn = localStorage.getItem('loggedIn');
    this.admin = localStorage.getItem('admin');

    this.api.getUsers().subscribe((data:User[]) =>{

      this.users = data

    },
      (err: HttpErrorResponse) => {

        console.log("Error in getting the users");
        console.log(err);

      })
  }

  /**This method is used to go to the page dedicated to modifying the data of the user**/
  modifyUser(user: User){

    this.router.navigateByUrl('/modify_profile/' + user._id).then()

  }

  /**This method is used to delete the user selected**/
  deleteUser(user: User){

    this.api.deleteUser(user._id).subscribe(

      () => console.log("User deleted"),

      (err: HttpErrorResponse) => {

        console.log("Error in the deletion of the user");
        console.log(err);

      });

    window.location.reload();

  }

  /**This method is used to search one or more users in the page**/
  search(user: string) {

    this.api.searchUser(user).subscribe((data: User[]) => {

      this.users = data;

    },
      (err: HttpErrorResponse) => {

        console.log("Error in searching users");
        console.log(err);

      })
  }

  /**This method is used to open the pop up that asks if the admin is sure to delete the user**/
  open(content, user) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {

      if (result === 'yes') {

        this.deleteUser(user);

      }
    }, (closed) => {});
  }

}

