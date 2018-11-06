import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private url="http://localhost/eSafe-gasoline_station/src/assets/api/person/";
  constructor(private http:HttpClient) { }

  addNewClient(clientData){
    return this.http.post(this.url +"addPerson",clientData);
  }
  editClient(clientData){
    return this.http.put(this.url +"editPerson",clientData);
  }
  deleteClient(PID){
    console.log(PID)
    return this.http.post(this.url +"deletePerson",{params:{PID:PID}});
  }
  getAllClients(isClient){
    return this.http.post(this.url +"getAllPerson",{params:{isClient:isClient}});
  }
}
