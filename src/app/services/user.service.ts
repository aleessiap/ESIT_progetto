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

  getAllUsers(): Observable<User[]> {

    return this.http.get<User[]>('http://localhost:8000/api/users')
  }

  getUser(name: string): Observable<User> {

    return this.http.get<User>('http://localhost:8000/api/users/' + name)
  }

  insertUser(user: User): Observable<User> {

    return this.http.post<User>('http://localhost:8000/api/users', user)

  }

  updateUser(user: User): Observable<void> {

    return this.http.put<void>('http://localhost:8000/api/users', user)

  }

  deleteUser(name: string) {

    return this.http.delete('http://localhost:8000/api/users/' + name)

  }

}

