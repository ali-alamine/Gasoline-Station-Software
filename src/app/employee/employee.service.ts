import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private url="http://localhost/eSafe-gasoline_station/src/assets/api/employee/";
  constructor(private http:HttpClient) { }

  getAllEmp(){
    return this.http.post(this.url +"getAllEmp",'');
  }
  addNewEmployee(empData){
    return this.http.post(this.url +"addNewEmployee",empData);
  }
  editEmployee(data){
    // console.log(data)
    return this.http.post(this.url +"editEmployee",data);
  }
  deleteEmployee(empID){
    return this.http.get(this.url +"deleteEmployee",{params:{empID:empID}});
  }
}
