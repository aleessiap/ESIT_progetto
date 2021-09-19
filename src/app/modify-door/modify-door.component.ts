import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {DoorService} from "../services/door.service";
import {Door} from "../../../server/models/door";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-modify-door',
  templateUrl: './modify-door.component.html',
  styleUrls: ['./modify-door.component.css']
})
export class ModifyDoorComponent implements OnInit {

  modifyDoor: FormGroup;
  loading = false;
  submitted = false;
  currentDoor: Door;
  idDoor : string;
  loggedIn : string | null;
  admin : string | null;
  modified : boolean;
  error: boolean;
  errorMessage: string;

  constructor(
    private fb: FormBuilder,
    public api: DoorService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.idDoor = params['_id'];
    })
  }

  initForm(){

    this.modifyDoor = this.fb.group({
      name: [this.currentDoor.name, Validators.required],
      aws_thing_name: [this.currentDoor.aws_thing_name, Validators.required],
      description: [this.currentDoor.description, Validators.required]
    })

  }

  ngOnInit(): void {
    this.modified = false;
    this.loggedIn = localStorage.getItem('loggedIn');
    this.admin = localStorage.getItem('admin');
    this.modifyDoor = this.fb.group({
      name: ['', Validators.required],
      aws_thing_name: ['', Validators.required],
      description: ['', Validators.required]
    })

    this.api.getDoor(this.idDoor).subscribe(data => {
      this.currentDoor = data;
      this.gettingData();
    },
      (err: HttpErrorResponse) => {
        console.log("Error in getting the door");
        console.log(err);
      });

  }

  onSubmit() {
    this.modified = false;
    this.error = false;
    this.submitted = true;
    if (this.modifyDoor.invalid) {
      return;
    }

    const doc = { currentDoor: this.currentDoor, data: this.modifyDoor.value}

    this.api.updateDoor(doc)
      .subscribe(() => {

          this.modified = true;
        },
      (err: HttpErrorResponse) => {
        console.log("Error in updating the door");
        this.error = true;
        console.log(err.error)
        if(err.error.hasOwnProperty('countName') && err.error.hasOwnProperty('countAws')) {
          if (err.error.countName > 0) {
            this.modifyDoor.controls['name'].setErrors({'incorrect': true});
          }
          if (err.error.countAws > 0) {
            this.modifyDoor.controls['aws_thing_name'].setErrors({'incorrect': true});
          }

        }
        this.errorMessage = err.error.msg;
      });


  }

  gettingData(){
    this.modifyDoor.controls['name'].setValue(this.currentDoor.name);
    this.modifyDoor.controls['aws_thing_name'].setValue(this.currentDoor.aws_thing_name);
    this.modifyDoor.controls['description'].setValue(this.currentDoor.description);
  }

}
