import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SetPricesService {
  private url="http://localhost/gasoline-station-software/src/assets/api/";
  constructor(private http:HttpClient) { }

  getFuelPrices(){
    return this.http.get(this.url +"container/getFuelPrices");
  }

  setNewPrices(data){
    return this.http.post(this.url +"container/setNewPrices",data);
  }
}
