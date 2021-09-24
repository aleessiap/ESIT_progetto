import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {
  registrationForm: FormGroup;
  submitted = false;
  loggedIn : string | null;
  admin : string | null;
  created : boolean;
  error : boolean;
  constructor(
    private  fb : FormBuilder,
    public api: UserService
  ) {

  }

  ngOnInit(): void {

    this.loggedIn = localStorage.getItem('loggedIn');
    this.admin = localStorage.getItem('admin');
    this.created = false;
    this.error = false;
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email:['', [Validators.required, Validators.email]],
      phone_num:['', [Validators.required, Validators.pattern("[0-9]{10}" )]],
      birthdate:['', [Validators.required]],
      username:['', [Validators.required]]
    })

  }


  onSubmit() {
    this.submitted = true;
    this.created = false;
    this.error = false;
    if (this.registrationForm.invalid) {
      return;
    }

    this.api.addUser(this.registrationForm.value)
      .subscribe((response) => {
          this.submitted = false;
          this.error = false;
          this.created = true;
          this.registrationForm.reset();
          this.registrationForm.markAsUntouched();
          this.registrationForm.markAsPristine();
        },
        (err) => {
          console.log("User already registered")

          this.error = true;

          if(err.error.email > 0){
            this.registrationForm.controls['email'].setErrors({'incorrect': true});
          }
          if(err.error.phone > 0){
            this.registrationForm.controls['phone_num'].setErrors({'incorrect': true});
          }
          if(err.error.username >0){
            this.registrationForm.controls['username'].setErrors({'incorrect': true});
          }
        });


  }
}
