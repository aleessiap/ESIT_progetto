import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {first} from 'rxjs/operators';
import {User} from "../../../server/models/user";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthenticationService} from "../services/authentication.service";



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
  constructor(
    private  fb : FormBuilder,
    public api: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email:['', [Validators.required, Validators.email]],
      phone_num:['', [Validators.required, Validators.pattern("[0-9]{10}" )]],
      birthdate:['', [Validators.required]],
    })

  }

  onSubmit() {
    this.submitted = true;

    // Se il form non è valido si ferma qui
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
      birthdate : this.registrationForm.controls.birthdate.value
    };

    //richiamo il servizio per poter collegare al server passandogli i dati del form
    this.api.addUser(this.registrationForm.value)
      .subscribe(() => {});
    this.registrationForm.reset();
    this.loading = true;
    this.newUser = user;
    alert("Registration succed!");
    this.router.navigateByUrl('/home')
  }
}
