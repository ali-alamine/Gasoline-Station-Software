import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ReturnService {
  private url="http://localhost/eSafe-gasoline_station/src/assets/api/";
  constructor(private http:HttpClient) { }
  getAllClients(isClient){
    // debugger
    return this.http.post(this.url +"person/getAllClients",{isClient:isClient});
  }
  addReturnInvoice(data){
    return this.http.post(this.url +"operation/addReturnInvoice",data);
  }
}
