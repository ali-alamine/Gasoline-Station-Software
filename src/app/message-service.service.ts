import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'


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
}