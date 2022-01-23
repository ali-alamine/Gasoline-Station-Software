import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageServiceService {

    private url = 'http://localhost/gasoline-station-software/src/assets/api/';
    constructor(private httpClient: HttpClient) {
     }
     getActiveSessions() {
        return this.httpClient.get(this.url + 'employee/isShiftOpened');
    }
    // logout(id){
    //     alert(id)
    //     return this.httpClient.post(this.url +"employee/logout",{'id':id});
    // }
    logout(data) {
        return this.httpClient.post(this.url + 'employee/logout', data);
    }
    getTotalDarwer(shiftID): Observable<any> {
        // tslint:disable-next-line: max-line-length
        return this.httpClient.get('http://localhost/gasoline-station-software/src/assets/api/apx/controllers/drawer/getTotalDarwer', {params: {shiftID: shiftID}});
    }
}
