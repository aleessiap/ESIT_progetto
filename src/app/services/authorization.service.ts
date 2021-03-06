import { Injectable } from '@angular/core';
import { User } from "../../../server/models/user";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(private http:HttpClient) { }

  getAllAuthorizations(): Observable<User[]>{
    return this.http.get<User[]>('/api/auths')
  }

  getAllNotAuthorized(): Observable<User[]>{
    return this.http.get<User[]>('/api/auths/denied')
  }

  getAuthorizations(_id: string): Observable<User[]> {
    return this.http.get<User[]>('/api/auths/' + _id)
  }

  getNotAuthorized(_id: string): Observable<User[]> {
    return this.http.get<User[]>('/api/auths/denied/' + _id)
  }

  insertAuthorization(door_id: string, user_id: string){

    return this.http.post<any>('/api/auths', {door_id: door_id, user_id: user_id});

  };

  updateAuthorizations(_id: string, old_pin:string, new_pin:string): Observable<void> {
    return this.http.put<void>('/api/auths', {_id: _id, old_pin: old_pin, new_pin: new_pin})
  }

  deleteAuthorizations(door_id: string, user_id: string) {
    return this.http.delete('/api/auths/' + door_id + '/' + user_id)
  }


}
