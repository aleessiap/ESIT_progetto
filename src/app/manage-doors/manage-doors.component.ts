import { Component, OnInit } from '@angular/core';
import {Door} from 'server/models/door';
import {DoorService} from "../services/door.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-manage-doors',
  templateUrl: './manage-doors.component.html',
  styleUrls: ['./manage-doors.component.css']
})
export class ManageDoorsComponent implements OnInit {
  doors: Door[] = [];

  constructor(private api: DoorService,
              private router: Router) {
  }


  ngOnInit(): void {
    this.api.getAllDoors().subscribe((data: Door[]) => {

      this.doors = data

    })
  }

  modifyDoor(door: Door) {
    console.log('Click on modify door');
    console.log(door.name)
    this.router.navigateByUrl('/modify_door/' + door._id)
  }

  deleteDoor(door: Door) {
    console.log('Click delete door');
    console.log(door.name)
    this.api.deleteDoor(door).subscribe(() => console.log("Door deleted"));

    window.location.reload();

  }

  search(door: string) {
    this.api.searchDoor(door).subscribe((data: Door[]) => {
      this.doors = data;
    })
  }
}
