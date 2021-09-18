import { Injectable } from '@angular/core';
import { User } from '../../../server/models/user'
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers()  {
    let API_URL = '/api/users/get-users'
    return this.http.get<User[]>(API_URL);
  }


  modifyUser(data: User): Observable<User> {
    let API_URL = '/api/users/';
    console.log('Update User controller');
    return this.http.put<User>(API_URL, data)

  }

  modifyPassword(data: any): Observable<User> {
    let API_URL = '/api/users/modify-password/' + data.id;
    console.log('Update User controller ' + API_URL);
    return this.http.put<User>(API_URL, data)
  }

  addUser(data: User): Observable<any> {
    let API_URL = '/api/users/add-user';
    return this.http.post<User>(API_URL, data)
  }

  deleteUser(id : string) {
    console.log('delete user service ' + id);
    return this.http.delete('/api/users/'+id)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  getUser(id : string): Observable<User> {
    let API_URL = '/api/users/' +id;
    console.log(API_URL)
    return this.http.get<User>(API_URL)
      .pipe(
        map(user => {
          if(user){
            console.log(user.userFound);
            return user.userFound;
          }
        })
      )
  }

  searchUser(user: string){
    let API_URL = '/api/users/search/'+user;
    console.log(API_URL);

    return this.http.get<User[]>(API_URL)
      .pipe(
        catchError(this.errorMgmt)
      )
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
    return throwError(errorMessage);
  }
}

