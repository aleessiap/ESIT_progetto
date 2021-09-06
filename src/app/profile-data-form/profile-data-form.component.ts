import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../services/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../../server/models/user";

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

  constructor(
    private  fb : FormBuilder,
    public api: AuthenticationService,
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
    this.profileForm.controls['birthdate'].setValue(this.user.birthdate);
    this.profileForm.controls['username'].setValue(this.user.username);
  }


  ngOnInit(): void {

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

    // Se il form non è valido si ferma qui
    if (this.profileForm.invalid) {
      return;
    }
    const doc = {
      id: this.idUser,
      profile: this.profileForm.value
    }
      //richiamo il servizio per poter collegare al server passandogli i dati del form
    this.api.modifyUser(doc)
      .subscribe(() => {});

    this.profileForm.reset();
    this.loading = true;
    alert("Modification succed!");
    this.router.navigateByUrl('/dashboard')
  }

}
