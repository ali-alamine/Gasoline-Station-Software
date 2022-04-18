import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class StartShiftService {
  private url="http://localhost/gasoline-station-software/src/assets/api/employee/";
  constructor(private http:HttpClient) { }

 startShift(data){
  return this.http.post(this.url +"addNewShift",data);
 }
}
