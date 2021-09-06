import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { User } from '../../../server/models/user';
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  public currentUser : User;
  public loggedIn : boolean;
  public admin: boolean;
  constructor(private http : HttpClient) {
    this.loggedIn = false;
    this.admin = false;
  }


  login(data): Observable<any> {
    console.log("getUser : " + data.username);

    let API_URL = '/api/users/login';

    return this.http.post<User>(API_URL, data)
      .pipe(map(user => {
        if(user.admin == true){
          this.admin = true;
        }
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser = user;

        this.loggedIn = true;
        console.log('User found in Rest service: '+ this.currentUser)
        return user;
      }));
  }

  logout() {
    console.log("logout");
    this.currentUser = '';
    this.loggedIn = false;
  }




}
