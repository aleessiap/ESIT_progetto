import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../../server/models/user";

@Component({
  selector: 'app-change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.css']
})
export class ChangePasswordFormComponent implements OnInit {
  changePassword: FormGroup;
  submitted = false;
  loggedIn : string | null;
  currentUser : string | null;
  id : string;
  user : User;
  notMatch : boolean;
  wrongPassword : boolean;

  constructor(    private  fb : FormBuilder,
                  public api: UserService,
                  private router: Router,
                  private activatedRoute: ActivatedRoute
  )  {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['_id'];
    })
  }


  ngOnInit(): void {
    this.notMatch= false;
    this.wrongPassword = false;
    this.loggedIn = localStorage.getItem('loggedIn');
    this.currentUser = localStorage.getItem('currentUser');
    this.changePassword = this.fb.group({
      oldPassword: ['', Validators.required],
      password: ['', Validators.required],
      confirmation:['', Validators.required]
    })
    this.api.getUser(this.id).subscribe(data => {
      this.user = data;})
  }

  save() {
    this.submitted = true;

    if (this.changePassword.invalid) {
      return;
    }

    if(this.changePassword.value.oldPassword == this.user.password) {
      if (this.changePassword.value.password != this.changePassword.value.confirmation) {
        this.notMatch = true;
        this.wrongPassword = false;
        console.log("not match")
        console.log("Correct ex pass " + this.user.password);

        console.log("Old pass " + this.changePassword.value.oldPassword);
        console.log("New pass " + this.changePassword.value.password);
        console.log("Confirmation " + this.changePassword.value.confirmation);
        alert("Error in new password!");
        return;
      }
      else {
        this.wrongPassword = false;
        this.notMatch = false;
        console.log("correct")
        console.log("Correct ex pass " + this.user.oldPassword);

        console.log("Old pass " + this.changePassword.value.oldPassword);
        console.log("New pass " + this.changePassword.value.password);
        console.log("Confirmation " + this.changePassword.value.confirmation);
        const doc = {
          id: this.id,
          password: this.changePassword.value.password
        }
        this.api.modifyPassword(doc)
          .subscribe(() => {});

        alert("Changed password!");
        this.router.navigateByUrl('/dashboard').then();
      }
    }
    else{
      this.wrongPassword = true;
      console.log("wrong passsword");
      console.log("Correct ex pass " + this.user.oldPassword);

      console.log("Old pass " + this.changePassword.value.oldPassword);
      console.log("New pass " + this.changePassword.value.password);
      console.log("Confirmation " + this.changePassword.value.confirmation);
      alert("Wrong password!");

      return;
    }

  }

}
