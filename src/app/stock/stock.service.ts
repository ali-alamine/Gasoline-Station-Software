import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class StockService {
  private url="http://localhost/eSafe-gasoline_station/src/assets/api/stock/";
  constructor(private http:HttpClient) { }

  addNewLub(lubData){
    return this.http.post(this.url +"addNewLub",lubData);
  }
  addNewAccess(accessData){
    return this.http.post(this.url +"addNewAccess",accessData);
  }

  getAllLubricants(){
    return this.http.get(this.url +"getAllLubricants");
  }
  getAllAccess(){
    return this.http.get(this.url +"getAllAccess");
  }

  getAllFuelContainers(){
    return this.http.get(this.url +"getAllFuelContainers");
  }
  editStock(data){
    return this.http.put(this.url +"editStock",data);
  }
  deleteStock(itemID){
    return this.http.post(this.url +"deleteStock",{params:{itemID:itemID}});
  }

}
