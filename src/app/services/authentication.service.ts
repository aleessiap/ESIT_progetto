import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { User } from '../../../server/models/user';
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  endpoint: string = '/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  public currentUser : Observable<User>;
  public loggedIn : boolean;
  constructor(private http : HttpClient) {
    this.loggedIn = false;
  }

  //
  login(data): Observable<any> {
    console.log("getUser : " + data.value);

    let API_URL = '/api/login';

    return this.http.post<User>(API_URL, data)
      .pipe(map(user => {

        sessionStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser = user;
        this.loggedIn = true;
        console.log('User found in Rest service: '+ this.currentUser)
        return user;
      }));

  }

  //Chiamata per leggere tutti gli utenti
  getUsers()  {
    let API_URL = '/api/get-users'
    return this.http.get(API_URL);
  }

  //Chiamata per la registrazione di un nuovo utente
  addUser(data: User): Observable<User> {
    let API_URL = '/api/add-user';
    return this.http.post<User>(API_URL, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }
// Error handling
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
