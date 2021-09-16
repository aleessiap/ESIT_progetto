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
  submittedPin = false;
  currentUser: string;
  admin : string;
  wrongPin: boolean;
  constructor(
    private fb: FormBuilder,
    private api: AuthenticationService,
    public router: Router
  ){}

  ngOnInit() {
    this.wrongPin = false;
    this.recoverPasswordFrom = this.fb.group({
      username: ['', [Validators.required]],
      pin: ['', [Validators.maxLength(5), Validators.minLength(5), Validators.pattern(/[0-9]{5}/)]],

    });

  }

  submitPinReqPressed() {
    this.submittedPinRequest = true;

    if(this.recoverPasswordFrom.invalid){

      this.submittedPinRequest = false;
      return;

    }

  }

}

