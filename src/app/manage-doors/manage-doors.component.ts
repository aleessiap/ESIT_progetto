import { Component, OnInit } from '@angular/core';
import {Door} from 'server/models/door';
import {DoorService} from "../services/door.service";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-manage-doors',
  templateUrl: './manage-doors.component.html',
  styleUrls: ['./manage-doors.component.css']
})
export class ManageDoorsComponent implements OnInit {
  doors: Door[] = [];
  loggedIn : string | null;
  admin : string | null;
  constructor(private api: DoorService,
              private router: Router) {
  }


  ngOnInit(): void {
    this.loggedIn = localStorage.getItem('loggedIn');
    this.admin = localStorage.getItem('admin');

    this.api.getAllDoors().subscribe((data: Door[]) => {
      this.doors = data
    }),
    (err: HttpErrorResponse) => {
      console.log("Error in getting the doors");
      alert("Error in getting the doors");
    }

  }

  modifyDoor(door: Door) {
    this.router.navigateByUrl('/modify_door/' + door._id)
  }

  deleteDoor(door: Door) {
    this.api.deleteDoor(door).subscribe(
      () => console.log("Door deleted"),
      (err:HttpErrorResponse) => {
            console.log("Error in the deletion of the door");
            alert("Error in the deletion of the door");
          }
    );
    window.location.reload();
  }

  search(door: string) {
    this.api.searchDoor(door).subscribe((data: Door[]) => {
      this.doors = data;
    }),
      (err: HttpErrorResponse) => {
        console.log("Error in the searching");
        alert("Error in the searching");
      }
  }

}
