import {Component, OnInit} from '@angular/core';
import {Door} from 'server/models/door';
import {DoorService} from "../services/door.service";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage-doors',
  templateUrl: './manage-doors.component.html',
  styleUrls: ['./manage-doors.component.css']
})

export class ManageDoorsComponent implements OnInit {

  doors: Door[] = [];

  loggedIn : string | null;
  admin : string | null;

  constructor(
    private api: DoorService,
    private router: Router,
    private modalService: NgbModal
  )
  {

  }

  ngOnInit(): void {

    this.loggedIn = localStorage.getItem('loggedIn');
    this.admin = localStorage.getItem('admin');

    this.api.getAllDoors().subscribe((data: Door[]) => {

      this.doors = data

    },
    (err: HttpErrorResponse) => {

      console.log("Error in getting the doors");
      console.log(err);

    })
  }

  /**This method is used to go to the page dedicated to modifying the data of the door**/
  modifyDoor(door: Door) {

    this.router.navigateByUrl('/modify_door/' + door._id).then()

  }

  /**This method is used to delete the door selected**/
  deleteDoor(door: Door) {

    this.api.deleteDoor(door).subscribe(

      () => console.log("Door deleted"),

      (err:HttpErrorResponse) => {

        console.log("Error in the deletion of the door");
          console.log(err);
      });

    window.location.reload();

  }

  /**This method is used to search one or more doors in the page**/
  search(door: string) {

    this.api.searchDoor(door).subscribe((data: Door[]) => {

      this.doors = data;

    },
      (err: HttpErrorResponse) => {

        console.log("Error in searching doors");
        console.log(err);

      })
  }

  /**This method is used to open the pop up that asks if the admin is sure to delete the door**/
  open(content, door) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {

      if (result === 'yes') {

        this.deleteDoor(door);

      }
    }, (closed) => {});
  }

}
