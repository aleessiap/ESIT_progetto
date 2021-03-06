import { Injectable } from '@angular/core';
import { Door } from '../../../server/models/door'
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DoorService {
  constructor(private http: HttpClient) { }

  getAllDoors(): Observable<Door[]> {
    return this.http.get<Door[]>('/api/doors')
  }

  getDoorsByUserId(_id: string | null): Observable<Door[]> {
    return this.http.get<Door[]>('/api/doors/user/' + _id)
  }

  getDoor(id : string): Observable<Door> {
    let API_URL = '/api/doors/' +id;
    console.log(API_URL)
    return this.http.get<Door>(API_URL)
      .pipe(
        map(door => {
          if(door){
            console.log(door.doorFound);
            return door.doorFound;
          }
        })
      )
  }

  insertDoor(door: Door): Observable<Door> {
    let API_URL = '/api/doors';
    return this.http.post<Door>(API_URL, door)

  }

  updateDoor(door: Door): Observable<void> {
    let API_URL = '/api/doors';
    console.log('update Door controller');
    return this.http.put<Door>(API_URL, door)
  }

  deleteDoor(door: Door) {
    let API_URL = '/api/doors/' + door._id;
    console.log(API_URL);
    return this.http.delete(API_URL)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  searchDoor(door: string){
    let API_URL = '/api/doors/search/'+door;
    console.log(API_URL);
    return this.http.get<Door[]>(API_URL)
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  lockDoor(_id: string) {

    let API_URL = '/api/doors/lock'

    return this.http.post<any>(API_URL, {_id:_id})

  }

  unlockDoor(_id: string) {

    let API_URL = '/api/doors/unlock'

    return this.http.post<any>(API_URL, {_id:_id})

  }

  searchDoorByUserId(door: string, user_id: string | null){
    let API_URL = '/api/doors/search/'+door + '/' + user_id;
    console.log(API_URL);
    return this.http.get<Door[]>(API_URL)
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
    console.log(error.statusText);
    return throwError(errorMessage);
  }

}
