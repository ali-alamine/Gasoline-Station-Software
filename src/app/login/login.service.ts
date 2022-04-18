import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) { }

  /* check loggin authentication */
  checkAuth(data) {
    const jsonData = JSON.stringify(data);
      // tslint:disable-next-line: max-line-length
      return this.httpClient.get('http://localhost:4200/gasoline-station-software/src/app/employee/checkLogin/', {params: {'data': jsonData}});
    }
}
