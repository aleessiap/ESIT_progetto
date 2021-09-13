import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { User } from '../../../server/models/user';
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http : HttpClient) {

  }

  login(data): Observable<any> {
    let API_URL = '/api/users/login';

    return this.http.post<User>(API_URL, data)
      .pipe(map(user => {
        return user;
      }));
  }

  logout(){
    localStorage.setItem('currentUser','None');
    localStorage.setItem('admin', 'false');
    localStorage.setItem('loggedIn','False');
    return this.http.get<any>('/api/users/logout')
      .pipe(
        catchError(this.errorMgmt)
      ) ;


  }

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
    console.log(error.statusText);
    return throwError(errorMessage);
  }


}
