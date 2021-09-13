import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../../server/models/user";
import {HttpErrorResponse} from "@angular/common/http";

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
  modified: boolean;
  wrongPassword: boolean;
  mismatch: boolean;

  constructor(    private  fb : FormBuilder,
                  public api: UserService,
                  private router: Router,
                  private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.id = params['_id'];
    })
  }


  ngOnInit(): void {

    this.modified = false;
    this.mismatch = false;
    this.wrongPassword = false;

    this.loggedIn = localStorage.getItem('loggedIn');
    this.currentUser = localStorage.getItem('currentUser');

    this.changePassword = this.fb.group({
      oldPassword: ['', Validators.required],
      password: ['', Validators.required],
      confirmation:['', Validators.required]
    })

    this.api.getUser(this.id).subscribe(data => {
      this.user = data;
    }),
    (err: HttpErrorResponse) => {
      console.log("Error in getting the user");
      alert("Error in getting the user");
    }
  }


  save() {
    this.submitted = true;

    if (this.changePassword.invalid) {
      return;
    }

    if(this.changePassword.value.oldPassword == this.user.password) {
      if (this.changePassword.value.password != this.changePassword.value.confirmation) {
        this.mismatch = true;
        return;
      }
      else {
        const doc = {
          id: this.id,
          password: this.changePassword.value.password
        }

        this.api.modifyPassword(doc)
          .subscribe(() => {}),
          (err: HttpErrorResponse) => {
            console.log("Error in modifying the password");
            alert("Error in modifying the password");
          };

        this.modified=true;
        this.router.navigateByUrl('/dashboard').then();
      }
    }
    else{
      this.wrongPassword = true;
      return;
    }

  }

  cancel(){
    this.router.navigateByUrl('/modify_profile/'+this.id);
  }
}
