import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { User } from '../../../server/models/user';

import {Router} from "@angular/router";
import {AuthenticationService} from "../services/authentication.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})

export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private api: AuthenticationService,
    public router: Router
  ){}

  ngOnInit() {

    this.loginForm = this.fb.group({
      username: ['', [Validators.required]], //il campo username è necessario e inizializzato come stringa vuota
      password: ['', [Validators.required]] //il campo password è necessario e inizializzato come stringa vuota
    });

  }

  loginPressed() {
    this.submitted = true;

    if(this.loginForm.invalid){
      return;
    }

    this.submitted = false;
    this.api.login(this.loginForm.value)
      .subscribe(
        (data:any) => {

          this.api.currentUser = data.userFound;
          console.log('Data of user logged in: ' + data.userFound.email + ' ' + data.userFound.password);
          console.log('Is it admin? ' + data.userFound.admin);

          this.router.navigateByUrl('/dashboard').then(r => window.location.reload());
        },
        (err:HttpErrorResponse) => {
          console.log("Error in the login");
        }
      );

  }

}
