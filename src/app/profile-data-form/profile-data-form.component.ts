import { Component, OnInit } from '@angular/core';

import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../../server/models/user";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-profile-data-form',
  templateUrl: './profile-data-form.component.html',
  styleUrls: ['./profile-data-form.component.css']
})

export class ProfileDataFormComponent implements OnInit {
  profileForm: FormGroup;
  loading = false;
  submitted = false;
  user : User;
  idUser: string;
  loggedIn : string | null;
  currentUser : string | null;
  modified : boolean;

  constructor(
    private  fb : FormBuilder,
    public api: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {

    this.activatedRoute.params.subscribe(params => {
      this.idUser = params['_id'];
    })

  }

  gettingData(){

    this.profileForm.controls['name'].setValue(this.user.name);
    this.profileForm.controls['surname'].setValue(this.user.surname);
    this.profileForm.controls['email'].setValue(this.user.email);
    this.profileForm.controls['phone_num'].setValue(this.user.phone_num);
    let bd = this.user.birthdate;
    this.profileForm.controls['birthdate'].setValue(bd.substring(0,10));
    console.log(this.user.birthdate)
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

  onSubmit() {
    this.submitted = true;

    if (this.profileForm.invalid) {
      return;
    }
    const doc = {
      id: this.idUser,
      profile: this.profileForm.value
    }

    this.api.modifyUser(doc)
      .subscribe(() => {}),
      (err: HttpErrorResponse) => {
        console.log("Error in updating the user");
        alert("Error in updating the user");
      };

    this.profileForm.reset();
    this.loading = true;
    this.modified = true;
    this.router.navigateByUrl('/dashboard').then();

  }
  changePassword(){
    this.router.navigateByUrl('change_password/'+ this.currentUser).then();
  }

  cancel(){
    if(this.currentUser == this.idUser){
      this.router.navigateByUrl('/dashboard');
    }else{
      this.router.navigateByUrl('/manage_users');
    }
  }
}
