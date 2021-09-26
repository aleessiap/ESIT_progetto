import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../../server/models/user";
import {HttpErrorResponse} from "@angular/common/http";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-profile-data-form',
  templateUrl: './profile-data-form.component.html',
  styleUrls: ['./profile-data-form.component.css']
})

export class ProfileDataFormComponent implements OnInit {

  profileForm: FormGroup;

  submitted = false;

  user : User;
  idUser: string;

  loggedIn : string | null;
  currentUser : string | null;

  modified : boolean;
  error: boolean;

  constructor(
    private fb : FormBuilder,
    public api: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal
  )
  {

    this.activatedRoute.params.subscribe(params => {
      this.idUser = params['_id'];
    })

  }

  /**This method is used to get the data from the user**/
  gettingData(){

    this.profileForm.controls['name'].setValue(this.user.name);
    this.profileForm.controls['surname'].setValue(this.user.surname);
    this.profileForm.controls['email'].setValue(this.user.email);
    this.profileForm.controls['phone_num'].setValue(this.user.phone_num);
    this.profileForm.controls['birthdate'].setValue(this.user.birthdate.substring(0,10));
    this.profileForm.controls['username'].setValue(this.user.username);

  }


  ngOnInit(): void {

    this.modified = false;

    this.loggedIn = localStorage.getItem('loggedIn');
    this.currentUser = localStorage.getItem('currentUser');

    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email:['', [Validators.required, Validators.email]],
      phone_num:['', [Validators.required, Validators.pattern("[0-9]{10}" )]],
      birthdate:['', [Validators.required]],
      username: ['', Validators.required]
    })

    this.api.getUser(this.idUser).subscribe(data => {
      this.user = data;
      this.gettingData();
    })

  }

  /**This method is used to save the modifications of the user data**/
  save() {

    this.error = false;
    this.submitted = true;

    let email = false, phone = false, username = false;

    //if the form is invalid, nothing is done
    if (this.profileForm.invalid) {
      return;
    }

    //It is checked if email, phone number and username are updated in the form
    if(this.user.email !== this.profileForm.value.email){
      email = true;
    }
    if(this.user.phone_num !== this.profileForm.value.phone_num){
      phone = true;
    }
    if(this.user.username !== this.profileForm.value.username){
      username = true;
    }


    const doc = {
      id: this.idUser,
      profile: this.profileForm.value,
      email : email,
      phone: phone,
      username: username
    }

    this.api.modifyUser(doc)
      .subscribe(() => {

          this.modified = true;

        },
        //If there is an error it is showed in the form and in the page
      (err: HttpErrorResponse) => {

        console.log("Error in updating the user");
        console.log(err.error.msg);

        this.error = true;

        if(err.error.email > 0){
          this.profileForm.controls['email'].setErrors({'incorrect': true});
        }
        if(err.error.phone > 0){
          this.profileForm.controls['phone_num'].setErrors({'incorrect': true});
        }
        if(err.error.username >0){
          this.profileForm.controls['username'].setErrors({'incorrect': true});
        }

      });

  }

  /**This method is used to go to the page dedicated to change the password**/
  changePassword(){
    this.router.navigateByUrl('change_password/'+ this.currentUser).then();
  }

  /**This method is used to go to the page before the one the user was **/
  cancel(){
    //If the user is modifying his profile, the page before was the dashboard
    if(this.currentUser == this.idUser){

      this.router.navigateByUrl('/dashboard');

    }else{
      //If the user is editing another user's data, the previous page was the user management page
      this.router.navigateByUrl('/manage_users');

    }
  }

  /**This method is used to open the pop up that asks if the user is sure to update the data of the user**/
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      if (result === 'yes') {
        this.save();
      }
    }, () => {});
  }

}
