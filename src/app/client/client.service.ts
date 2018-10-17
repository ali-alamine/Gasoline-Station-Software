import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private url="http://localhost/gasolineStation/src/assets/api/person/";
  constructor(private http:HttpClient) { }

  addNewClient(clientData){
    return this.http.post(this.url +"addClient",clientData);
  }
  getAllClients(){
    return this.http.post(this.url +"getAllClients",'');
  }
}
