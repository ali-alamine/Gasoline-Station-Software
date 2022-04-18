import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageServiceService {
    private url = 'http://localhost:4200/gasoline-station-software/src/assets/api/appx/controllers/';
    // 
    constructor(private httpClient: HttpClient) {
     }
     getActiveSessions(): Observable<Object> {
      return this.httpClient.get(this.url + 'employee/isShiftOpened_get');
    }
      logout(data) {
        return this.httpClient.post(this.url + 'employee/logout', data);
    }
    getTotalDarwer(shiftID): Observable<any> {
        // tslint:disable-next-line: max-line-length
        return this.httpClient.get('http://localhost:4200/gasoline-station-software/src/assets/api/appx/controllers/drawer/getTotalDarwer', {params: {shiftID: shiftID}});
    }
}
