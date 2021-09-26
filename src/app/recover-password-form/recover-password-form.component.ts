import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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
  wrongPin: boolean;

  currentUser: string;
  admin : string;

  errorMsg: string = '';

  constructor(
    private fb: FormBuilder,
    private api: AuthenticationService,
    public router: Router
  ){

  }

  ngOnInit() {
    this.wrongPin = false;

    this.recoverPasswordFrom = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      pin: ['', [Validators.maxLength(5), Validators.minLength(5), Validators.pattern(/[0-9]{5}/)]],
    });

  }

  /**This method is used to submit the request for a PIN.**/
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
        //If there is an error it is showed in the form
        this.errorMsg = err.error.msg

      });

    }

  }

  /**This method is used to submit the PIN to recover the password.**/
  submitPinPressed() {

    this.errorMsg = ''
    this.submittedPin = true

    if(this.recoverPasswordFrom.controls.pin.invalid){

    } else {

      this.api.recover_password(this.recoverPasswordFrom.controls.pin.value).subscribe(()=>{}, (err: HttpErrorResponse) => {
        //If there is an error it is showed in the form
        this.errorMsg = err.error.msg

      })

    }

    setInterval(() => {this.router.navigateByUrl('/login')}, 5000)

  }

}

