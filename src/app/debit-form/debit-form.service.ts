import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DebitFormService {
  private url="http://localhost/eSafe-gasoline_station/src/assets/api/";
  constructor(private http:HttpClient) { }
  getAllClients(){
    return this.http.post(this.url +"person/getAllClients",'');
  }
  sellLubOnDebit(data){
    console.log("here we go")
    console.log(data)
    return this.http.post(this.url +"operation/sell",data);
  }
  sellWashServOnDebit(data){
    console.log("here we go was")
    console.log(data)
    return this.http.post(this.url +"operation/sellWashServiceOnDebit",data);
  }
}
