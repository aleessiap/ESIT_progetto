import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { User } from '../../../server/models/user';
import {Observable} from "rxjs";
import { map} from "rxjs/operators";

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

  logout() {
    localStorage.setItem('currentUser','None');
    localStorage.setItem('admin', 'false');
    localStorage.setItem('loggedIn','False');
  }


}
