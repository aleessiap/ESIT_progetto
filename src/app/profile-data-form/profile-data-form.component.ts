import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";
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
  currentUser = this.api.currentUser;
  loggedIn = this.api.loggedIn;
  constructor(
    private  fb : FormBuilder,
    public api: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: [this.api.currentUser.name, Validators.required],
      surname: [this.api.currentUser.surname, Validators.required],
      email:[this.api.currentUser.email, [Validators.required, Validators.email]],
      phone_num:[this.api.currentUser.phone_num, [Validators.required, Validators.pattern("[0-9]{10}" )]],
      birthdate:[this.api.currentUser.birthdate, [Validators.required]],
      username: [this.api.currentUser.username, Validators.required]
    })

  }

  onSubmit() {
    this.submitted = true;

    // Se il form non è valido si ferma qui
    if (this.profileForm.invalid) {
      return;
    }
    const doc = { currentUser: this.api.currentUser, profile: this.profileForm.value}
      //richiamo il servizio per poter collegare al server passandogli i dati del form
    this.api.modifyUser(doc)
      .subscribe(() => {});
    this.profileForm.reset();
    this.loading = true;
    alert("Modification succed!");
    this.router.navigateByUrl('/home')
  }

}
