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

  //Chiamata per leggere tutti gli utenti
  getUsers()  {
    let API_URL = '/api/users/get-users'
    return this.http.get<User[]>(API_URL);
  }

  modifyUser(data: User): Observable<User>{
    let API_URL = '/api/users/modify-user';
    return this.http.post<User>(API_URL, data)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  //Chiamata per la registrazione di un nuovo utente
  addUser(data: User): Observable<User> {
    let API_URL = '/api/users/add-user';
    return this.http.post<User>(API_URL, data)
      .pipe(
        catchError(this.errorMgmt)
      )

  }

  deleteUser(id : string) {
    //let API_URL = '/api/users/613511db07b9cd05d4256bbc';
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
