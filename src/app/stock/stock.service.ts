import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class StockService {
  private url="http://localhost/eSafe-gasoline_station/src/assets/api/";
  constructor(private http:HttpClient) { }

  addNewLub(lubData){
    return this.http.post(this.url +"stock/addNewLub",lubData);
  }
  addNewAccess(accessData){
    return this.http.post(this.url +"stock/addNewAccess",accessData);
  }

  getAllLubricants(){
    return this.http.get(this.url +"stock/getAllLubricants");
  }
  getAllAccess(){
    return this.http.get(this.url +"stock/getAllAccess");
  }

  editStock(data){
    return this.http.post(this.url +"stock/editStock",data);
  }
  deleteStock(itemID){
    return this.http.get(this.url +"stock/deleteStock",{params:{itemID:itemID}});
  }
  getAllFuelContainers(){
    return this.http.get(this.url +"container/getFuelContainer");
  }

}
