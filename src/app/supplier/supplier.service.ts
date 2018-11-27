import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private url="http://localhost/eSafe-gasoline_station/src/assets/api/person/";
  constructor(private http:HttpClient) { }

  addSupplier(data){
    return this.http.post(this.url +"addPerson",data);
  }
  editSupplier(data){
    return this.http.post(this.url +"editPerson",data);
  }
  deleteSupplier(PID){
    console.log(PID)
    return this.http.get(this.url +"deletePerson",{params:{PID:PID}});
  }
  getAllSupplier(isClient){
    return this.http.post(this.url +"getAllPerson",{params:{isClient:isClient}});
  }
}
