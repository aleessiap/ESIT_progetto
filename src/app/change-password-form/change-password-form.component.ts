import {Component, OnInit} from '@angular/core';
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

  loggedIn : string | null;
  currentUser : string | null;

  id : string;
  user : User;

  submitted = false;
  modified: boolean;
  wrongPassword: boolean;
  mismatch: boolean;

  constructor(
    private  fb : FormBuilder,
    public api: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  )
  {

    this.activatedRoute.params.subscribe(params => {
      this.id = params['_id'];
    })

  }

  ngOnInit(): void {

    //Initializations of variables
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

      },
      (err: HttpErrorResponse) => {

        console.log("Error in getting the user");
        console.log(err);

      })
  }

  /**This method is used to save correctly the new password**/
  save() {

    this.submitted = true;

    //If the form is invalid, nothing is done
    if (this.changePassword.invalid) {
      return;
    }

    //If the confirmation of the new password is different from the new password, there is an error
    if (this.changePassword.value.password != this.changePassword.value.confirmation) {

      this.mismatch = tru;
      return;

    }
    else {
      //If the confirmation matches the new password, the procedure can be done
      const doc = {
        id: this.id,
        form: this.changePassword.value

      }

      this.api.modifyPassword(doc)
        .subscribe(() => {},
          (err: HttpErrorResponse) => {

            if(err.error.msg === 'La vecchia password è scorretta') {

              this.wrongPassword = true

            }

            console.log("Error in modifying the password");
            console.log(err.error.msg);

          });

      this.modified=true;
      this.router.navigateByUrl('/modify_profile/'+this.id).then();

    }
  }

  /**This method is used to go back to the previous page**/
  cancel(){
    this.router.navigateByUrl('/modify_profile/'+this.id);
  }
}
