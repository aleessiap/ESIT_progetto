import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../server/models/user";
import {UserService} from "../services/user.service";



@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {
  registrationForm: FormGroup;
  loading = false;
  submitted = false;
  newUser : User;
  loggedIn : string | null;
  admin : string | null;
  constructor(
    private  fb : FormBuilder,
    public api: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loggedIn = localStorage.getItem('loggedIn');
    this.admin = localStorage.getItem('admin');
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email:['', [Validators.required, Validators.email]],
      phone_num:['', [Validators.required, Validators.pattern("[0-9]{10}" )]],
      birthdate:['', [Validators.required]],
      username:['', [Validators.required]]
    })

  }


  onSubmit() {
    this.submitted = true;

    if (this.registrationForm.invalid) {
      return;
    }
    //creo l'utente
    //forse si può evitare ma non ne sono sicura
    const user : User = {
      name: this.registrationForm.controls.name.value,
      surname : this.registrationForm.controls.surname.value,
      email : this.registrationForm.controls.email.value,
      phone_num : this.registrationForm.controls.phone_num.value,
      birthdate : this.registrationForm.controls.birthdate.value,
      username: this.registrationForm.controls.username.value
    };

    //richiamo il servizio per poter collegare al server passandogli i dati del form
    this.api.addUser(this.registrationForm.value)
      .subscribe(() => {});
    this.registrationForm.reset();
    this.loading = true;
    this.newUser = user;
    alert("Registration succed!");
    this.router.navigateByUrl('/dashboard')
  }
}
