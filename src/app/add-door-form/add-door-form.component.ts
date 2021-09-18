import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Door} from "../../../server/models/door";
import {DoorService} from "../services/door.service";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";


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
  loggedIn : string | null;
  admin : string | null;
  created : boolean;
  error: boolean;

  constructor(
    private  fb : FormBuilder,
    public api: DoorService
  ) {

  }

  ngOnInit(): void {
    this.created = false;
    this.loggedIn = localStorage.getItem('loggedIn');
    this.admin = localStorage.getItem('admin');

    this.registerDoor = this.fb.group({
      name: ['', Validators.required],
      aws_thing_name: ['', Validators.required],
      description:['', Validators.required],
    })

  }

  create(){
    this.error= false;
    this.submitted = true;
    this.created = false;

    if (this.registerDoor.invalid) {
      return;
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
      .subscribe(() => {

          this.submitted = false;
          this.created = true;
          this.registerDoor.reset();
          this.registerDoor.markAsUntouched();
          this.registerDoor.markAsPristine();

        },
      (err: HttpErrorResponse) => {
        console.log("Error inserting the door");
        console.log(err.error);
        this.error= true;
        if(err.error.countName > 0){
          console.log("name")
          this.registerDoor.controls['name'].setErrors({'incorrect': true});
        }
        if(err.error.countAws > 0){
          console.log("aws")
          this.registerDoor.controls['aws_thing_name'].setErrors({'incorrect': true});
        }

      });




  }
}
