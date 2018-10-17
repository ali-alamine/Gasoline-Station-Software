import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private url="http://localhost/gasolineStation/src/assets/api/employee/";
  constructor(private http:HttpClient) { }

  getAllEmp(){
    return this.http.post(this.url +"getAllEmp",'');
  }
  addNewClient(empData){
    return this.http.post(this.url +"addNewClient",empData);
  }
}
