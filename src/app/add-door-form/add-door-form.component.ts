import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Door} from "../../../server/models/door";
import {DoorService} from "../services/door.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-door-form',
  templateUrl: './add-door-form.component.html',
  styleUrls: ['./add-door-form.component.css']
})
export class AddDoorFormComponent implements OnInit {
  registerDoor: FormGroup;
  newDoor : Door;
  loading = false;
  submitted = false;

  constructor(
    private  fb : FormBuilder,
    public api: DoorService
  ) { }

  ngOnInit(): void {
    this.registerDoor = this.fb.group({
      name: ['', Validators.required],
      aws_thing_name: ['', Validators.required],
      description:['', Validators.required],
    })
  }

  create(){
    this.submitted = true;

    // Se il form non è valido si ferma qui
    if (this.registerDoor.invalid) {
      return;
    }else{
      this.loading = true;
    }
    const body = {};
    const newDoor : Door = {
      name: this.registerDoor.controls.name.value,
      aws_thing_name : this.registerDoor.controls.aws_thing_name.value,
      description : this.registerDoor.controls.description.value,
      state: false,
      online: false,
      authorizations : body
    };

    this.api.insertDoor(newDoor)
      .subscribe(() => {});
    this.submitted = false;
    this.registerDoor.reset();
    this.registerDoor.clearValidators();
    this.loading = false;

    alert("Registration succeed!");

  }
}
