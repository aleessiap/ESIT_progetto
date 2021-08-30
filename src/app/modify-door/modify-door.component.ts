import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {DoorService} from "../services/door.service";
import {Door} from "../../../server/models/door";

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
  gettingData(){
    this.modifyDoor.controls['name'].setValue(this.currentDoor.name);
    this.modifyDoor.controls['aws_thing_name'].setValue(this.currentDoor.aws_thing_name);
    this.modifyDoor.controls['description'].setValue(this.currentDoor.description);
  }
  initForm(){
    this.modifyDoor = this.fb.group({
      name: [this.currentDoor.name, Validators.required],
      aws_thing_name: [this.currentDoor.aws_thing_name, Validators.required],
      description: [this.currentDoor.description, Validators.required]
    })
  }

  ngOnInit(): void {

    this.modifyDoor = this.fb.group({
      name: ['', Validators.required],
      aws_thing_name: ['', Validators.required],
      description: ['', Validators.required]
    })


    this.api.getDoor(this.idDoor).subscribe(data => {
      this.currentDoor = data;
      this.gettingData();
    })
    //this.gettingData();
    //console.log(this.nameDoor);
    //this.currentDoor = this.api.getDoor(this.nameDoor);
    //console.log('found door : '  + this.currentDoor.name + ' ' +this.currentDoor.description);



  }

  onSubmit() {
    this.submitted = true;

    // Se il form non è valido si ferma qui
    if (this.modifyDoor.invalid) {
      return;
    }
    const doc = { currentDoor: this.currentDoor, data: this.modifyDoor.value}
    //richiamo il servizio per poter collegare al server passandogli i dati del form
    this.api.updateDoor(doc)
      .subscribe(() => {});
    this.loading = true;
    alert("Modification succed!");

  }
}
