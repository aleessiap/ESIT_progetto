import { Component, OnInit } from '@angular/core';
import {User} from 'server/models/user'
import {Door} from 'server/models/door'
import {Access} from 'server/models/door'
import {AuthenticationService} from "../services/authentication.service";
import {DoorService} from "../services/door.service";
import {AccessService} from "../services/access.service";
import {UserService} from "../services/user.service";
import {HttpErrorResponse} from "@angular/common/http";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  doors: Door[] = [];
  access = {};
  search_value: string = ''

  currentUser : string | null;
  loggedIn : string | null;
  admin : string | null;

  constructor(private api_door: DoorService,
              private api_auth: AuthenticationService,
              private api_accs: AccessService,
              private api_user: UserService
  ){}

  ngOnInit(): void {

    this.currentUser = localStorage.getItem('currentUser');
    this.loggedIn = localStorage.getItem('loggedIn');
    this.admin = localStorage.getItem('admin');

    if(this.admin === 'true') {

      this.api_door.getAllDoors().subscribe((data: Door[]) => {

        this.doors = data

        for (const door of this.doors) {

          this.api_accs.getAccessByDoorId(door._id).subscribe((data: Access[]) => {

            data.forEach((value) => {
              value['time'] = new Date(value['createdAt']).toLocaleTimeString()
              value['date'] = new Date(value['createdAt']).toLocaleDateString()

              this.api_user.getUser(value['user_id']).subscribe((data: User) => {

                value['username'] = data.username

              })

            })
            this.access[door._id] = data.reverse()
          },
            (error: HttpErrorResponse) =>{
            console.log("Error occurred in the dashboard");
            console.log(error)
          });

        }
      })

    } else {

      this.api_door.getDoorsByUserId(this.currentUser).subscribe((data: Door[]) => {

        this.doors = data

        for (const door of this.doors) {

          this.api_accs.getAccessByDoorIdAndUserId(door._id, this.currentUser).subscribe((data: Access[]) => {

            data.forEach((value) => {
              value['time'] = new Date(value['createdAt']).toLocaleTimeString()
              value['date'] = new Date(value['createdAt']).toLocaleDateString()

              this.api_user.getUser(value['user_id']).subscribe((data: User) => {

                value['username'] = data.username

              })

            })
            this.access[door._id] = data.reverse()
          },
            (error: HttpErrorResponse) =>{
              console.log("Error occurred in the dashboard");
              console.log(error)
            });

        }
      })

    }

    setInterval(() => {this.search_door(this.search_value)}, 1000)

  }

  search_door(door: string) {

    if (door === '') {

      if(this.admin === 'true') {

        this.api_door.getAllDoors().subscribe((data: Door[]) => {

          this.doors = data

          for (const door of this.doors) {

            if (door.state == 2) {

              this.api_accs.getAccessByDoorId(door._id).subscribe((data: Access[]) => {
                data.forEach((value) => {
                  value['time'] = new Date(value['createdAt']).toLocaleTimeString()
                  value['date'] = new Date(value['createdAt']).toLocaleDateString()

                  this.api_user.getUser(value['user_id']).subscribe((data: User) => {

                    value['username'] = data.username

                  })

                })
                this.access[door._id] = data.reverse()
              },
                (error: HttpErrorResponse) =>{
                  console.log("Error occurred in the dashboard");
                  console.log(error)
                });

            }

          }

        })

      } else {

        this.api_door.getDoorsByUserId(this.currentUser).subscribe((data: Door[]) => {

          this.doors = data

          for (const door of this.doors) {

            if (door.state == 2) {

              this.api_accs.getAccessByDoorIdAndUserId(door._id, this.currentUser).subscribe((data: Access[]) => {
                data.forEach((value) => {
                  value['time'] = new Date(value['createdAt']).toLocaleTimeString()
                  value['date'] = new Date(value['createdAt']).toLocaleDateString()

                  this.api_user.getUser(value['user_id']).subscribe((data: User) => {

                    value['username'] = data.username

                  })

                })
                this.access[door._id] = data.reverse()
              },
                (error: HttpErrorResponse) =>{
                  console.log("Error occurred in the dashboard");
                  console.log(error)
                });

            }

          }

        })

      }

    } else {

      if(this.admin === 'true') {

        this.api_door.searchDoor(door).subscribe((data: Door[]) => {

          this.doors = data

          for (const door of this.doors) {

            if (door.state == 2) {

              this.api_accs.getAccessByDoorId(door._id).subscribe((data: Access[]) => {
                data.forEach((value) => {
                  value['time'] = new Date(value['createdAt']).toLocaleTimeString()
                  value['date'] = new Date(value['createdAt']).toLocaleDateString()

                  this.api_user.getUser(value['user_id']).subscribe((data: User) => {

                    value['username'] = data.username

                  })

                })
                this.access[door._id] = data.reverse()
              },
                (error: HttpErrorResponse) =>{
                  console.log("Error occurred in the dashboard");
                  console.log(error)
                });

            }

          }

        })

      } else {

        this.api_door.searchDoorByUserId(door, this.currentUser).subscribe((data: Door[]) => {

          this.doors = data

          for (const door of this.doors) {

            if (door.state == 2) {

              this.api_accs.getAccessByDoorIdAndUserId(door._id, this.currentUser).subscribe((data: Access[]) => {
                data.forEach((value) => {
                  value['time'] = new Date(value['createdAt']).toLocaleTimeString()
                  value['date'] = new Date(value['createdAt']).toLocaleDateString()

                  this.api_user.getUser(value['user_id']).subscribe((data: User) => {

                    value['username'] = data.username

                  })

                })
                this.access[door._id] = data.reverse()
              },
                (error: HttpErrorResponse) =>{
                  console.log("Error occurred in the dashboard");
                  console.log(error)
                });

            }

          }

        })


      }

    }

  }

}
