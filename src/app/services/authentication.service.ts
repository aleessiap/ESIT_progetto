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
        console.log(data);
        this.admin = user.userFound.admin;
        this.currentUser = user.userFound;

        console.log("Admin "+ String(this.admin.valueOf()));
        console.log('User found in Rest service: '+ this.currentUser)

        //sessionStorage.setItem('currentUser', JSON.stringify(user));

        this.loggedIn = true;
        return user;
      }));
  }

  logout() {
    console.log("logout");
    this.loggedIn = false;
    this.admin = false;
    this.currentUser = '';
    localStorage.setItem('currentUser','None');
    localStorage.setItem('admin', String(this.admin.valueOf()));
    localStorage.setItem('loggedIn','False');


  }
  getAdmin(){

    return this.admin;
  }
  getCurrentUser(){
    return this.currentUser;
  }
  isLogged(){
    return this.loggedIn;
  }

}
