import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ReturnService {
  private url="http://localhost/gasoline-station-software/src/assets/api/";
  constructor(private http:HttpClient) { }
  getAllClients(isClient){
    // debugger
    return this.http.post(this.url +"person/getAllPerson",{isClient:isClient});
  }
  addReturnInvoice(data){
    return this.http.post(this.url +"operation/addReturnInvoice",data);
  }
  searchClient(data){
    return this.http.get("http://localhost/gasoline-station-software/src/assets/api/person/searchClientName", {params:{keyword:data}});
  }
}
