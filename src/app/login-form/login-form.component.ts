import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { User } from '../user';

import {Router} from "@angular/router";
import {AuthenticationService} from "../services/authentication.service";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})

export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  user : User;
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
        res => {
          this.user = res;
          console.log('User logged in: ' +this.user.email + ' ' + this.user.password)
          this.router.navigateByUrl('/home');
        },
        err => {
          console.log("Error in login");
          //pop up o form error
        }
      );

  }

}
