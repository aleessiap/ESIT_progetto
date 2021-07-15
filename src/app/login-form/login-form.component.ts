import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginService} from "../services/login.service";
import { User } from '../user';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  angForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private login: LoginService,
  ){}
  model = new User(0,0,false,'','','','','');
  ngOnInit() {
    this.angForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.submitted = false;

  }
  onSubmit() {
    this.submitted = true;
    if(this.angForm.invalid){
      return;
    }
    alert('SUCCESS');
  }

  loginPressed() {

    const username = this.angForm.controls.username.value;
    const password = this.angForm.controls.password.value;
    console.log(username);
    console.log(password);
    this.model = new User(1,250,false,password,'name','surname',username,'birth');
    this.submitted = false;
  }

  onReset(){
    this.submitted=false;
    this.angForm.reset();
  }
}
