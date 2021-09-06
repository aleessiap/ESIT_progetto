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
      .pipe(
        catchError(this.errorMgmt)
      )
  }

  updateDoor(door: Door): Observable<void> {
    let API_URL = '/api/doors';
    console.log('update Door controller');
    return this.http.put<Door>(API_URL, door)
      .pipe(
        catchError(this.errorMgmt)
      )
    //return this.http.put<void>('http://localhost:8000/api/doors', door)

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
    console.log(error.statusText);
    return throwError(errorMessage);
  }

}
