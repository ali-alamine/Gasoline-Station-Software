import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private url="http://localhost/eSafe-gasoline_station/src/assets/api/";
  constructor(private httpClient:HttpClient) { }

  getTodayEmp(){
    return this.httpClient.post(this.url +"employee/getTodayEmp",'');
  }
  getAllEmp(){
    return this.httpClient.post(this.url +"employee/getAllEmp",'');
  }
  getShiftDetails(data): Observable<any>{
    return this.httpClient.post(this.url +"invoice/getShiftDetails", data);
  }
  
  getTypeDetails(data): Observable<any>{
    return this.httpClient.post(this.url +"invoice/getTypeDetails", data);
  }
  
  getShiftTypeDetails(data): Observable<any>{
    return this.httpClient.post(this.url +"invoice/getShiftTypeDetails", data);
  }
}