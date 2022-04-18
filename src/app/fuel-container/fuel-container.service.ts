import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FuelContainerService {

  constructor(private http: HttpClient) { }
  private url="http://localhost/gasoline-station-software/src/assets/api/";
  getAllFuelContainers(){
    return this.http.get(this.url +"container/getFuelContainer");
  }

  getAllSuppliers(isClient){
    return this.http.post(this.url +"person/getAllClients",{isClient:0});
  }
  submitSupplyFuel(data){
    // console.log(data)
    return this.http.post(this.url +"operation/supplyFuel",data);
  }
}
