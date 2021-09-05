import { Component, OnInit } from '@angular/core';
import {Door} from 'server/models/door';
import {DoorService} from "../services/door.service";

@Component({
  selector: 'app-manage-doors',
  templateUrl: './manage-doors.component.html',
  styleUrls: ['./manage-doors.component.css']
})
export class ManageDoorsComponent implements OnInit {
  doors: Door[] = [];

  constructor(private api:DoorService) { }

  ngOnInit(): void {
    this.api.getAllDoors().subscribe((data: Door[]) => {

      this.doors = data

    })
  }

}
