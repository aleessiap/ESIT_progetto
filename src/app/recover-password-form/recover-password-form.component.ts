import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { User } from '../../../server/models/user';

import {Router} from "@angular/router";
import {AuthenticationService} from "../services/authentication.service";
import {HttpErrorResponse} from "@angular/common/http";


@Component({
  selector: 'app-recover-password-form',
  templateUrl: './recover-password-form.component.html',
  styleUrls: ['./recover-password-form.component.css']
})
export class RecoverPasswordFormComponent implements OnInit {
  recoverPasswordFrom: FormGroup;
  submittedPinRequest = false;
  submittedPinRequestSuccess = false;
  submittedPin = false;
  currentUser: string;
  admin : string;
  wrongPin: boolean;
  errorMsg: string = '';

  constructor(
    private fb: FormBuilder,
    private api: AuthenticationService,
    public router: Router
  ){}

  ngOnInit() {
    this.wrongPin = false;
    this.recoverPasswordFrom = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      pin: ['', [Validators.maxLength(5), Validators.minLength(5), Validators.pattern(/[0-9]{5}/)]],

    });

  }

  submitPinReqPressed() {

    this.errorMsg = ''
    this.submittedPinRequest = true;

    if(this.recoverPasswordFrom.controls.email.invalid){

      this.submittedPinRequestSuccess = false;

    } else {

      this.api.recover_password_pin_req(this.recoverPasswordFrom.value.email).subscribe(data => {

        this.submittedPinRequestSuccess = data.success;

        if (this.submittedPinRequestSuccess) {

          this.recoverPasswordFrom.controls.email.disable()

        }

      }, (err: HttpErrorResponse) => {

        this.errorMsg = err.error.msg

      });

    }

  }

  submitPinPressed() {

    this.errorMsg = ''
    this.submittedPin = true

    if(this.recoverPasswordFrom.controls.pin.invalid){


    } else {

      this.api.recover_password(this.recoverPasswordFrom.controls.pin.value).subscribe(()=>{}, (err: HttpErrorResponse) => {

        this.errorMsg = err.error.msg

      })

    }

    // this.router.navigateByUrl('/login')

  }

}

