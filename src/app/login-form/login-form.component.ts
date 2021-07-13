import { Component, OnInit, Input } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoginService} from '../login.service';
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  angForm: FormGroup;
  @Input() check;
  username;
  password;
  constructor(private fb:FormBuilder, private login:LoginService) {

    this.angForm = this.fb.group({
      username:[''],
      password:['']
    });

  }


  access(){
    const username=this.angForm.controls.username.value;
    const password= this.angForm.controls.password.value;
    this.login.access(username, password).subscribe(
      data =>{
        this.username = data;
        this.password = data;
      }
    )
  }
  ngOnInit(): void {
  }

}
