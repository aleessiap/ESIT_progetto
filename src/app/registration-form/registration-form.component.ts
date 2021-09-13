import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../server/models/user";
import {UserService} from "../services/user.service";
import {HttpErrorResponse} from "@angular/common/http";



@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {
  registrationForm: FormGroup;
  loading = false;
  submitted = false;
  loggedIn : string | null;
  admin : string | null;
  created : boolean;

  constructor(
    private  fb : FormBuilder,
    public api: UserService,
    private router: Router
  ) {

  }

  ngOnInit(): void {

    this.loggedIn = localStorage.getItem('loggedIn');
    this.admin = localStorage.getItem('admin');
    this.created = false;

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

    if (this.registrationForm.invalid) {
      return;
    }

    this.api.addUser(this.registrationForm.value)
      .subscribe(() => {}),
      (err: HttpErrorResponse) => {
        console.log("Error in adding the user");
        alert("Error in adding the user");
      };

    this.loading = true;
    this.created= true;
  }
}
