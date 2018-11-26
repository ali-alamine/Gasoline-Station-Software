import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageServiceService {

    private url="http://localhost/eSafe-gasoline_station/src/assets/api/";
    constructor(private httpClient:HttpClient) { }
 
    getActiveSessions(){
        return this.httpClient.get(this.url +"employee/isShiftOpened");
    }
    logout(id){
        return this.httpClient.post(this.url +"employee/logout",{'id':id});
    }
    // logout(data){
    //     return this.httpClient.post(this.url +"employee/logout",data);
    // }
    getTotalDarwer(shiftID): Observable<any>{
        return this.httpClient.get('http://localhost/eSafe-gasoline_station/src/assets/api/drawer/getTotalDarwer', {params:{shiftID:shiftID}});
    }
}