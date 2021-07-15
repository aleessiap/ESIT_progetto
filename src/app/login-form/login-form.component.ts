import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { User } from '../user';

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
  ){}
  model = new User(0,0,false,'','','','','');
  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  onSubmit() {
    this.submitted = true;
    if(this.loginForm.invalid){
      return;
    }
    alert('SUCCESS');
  }

  loginPressed() {

    const username = this.loginForm.controls.username.value;
    const password = this.loginForm.controls.password.value;
    console.log(username);
    console.log(password);
    this.model = new User(1,250,false,password,'name','surname',username,'birth');
    this.submitted = false;
  }

  onReset(){
    this.submitted=false;
    this.loginForm.reset();
  }
}
