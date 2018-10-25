
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit { 
  userType:object;

  loginForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl()
  });

  constructor(private loginServ:LoginService,private router: Router) {}

  ngOnInit() {}

  checkLogIn(){
    this.loginServ.checkAuth(this.loginForm.value).subscribe(Response=>{
       loginServ => this.userType = loginServ;
 
      if(Response[0].user_type==0){
        localStorage.setItem("userID",Response[0].empID);
        localStorage.setItem("userName",Response[0].name);
        localStorage.setItem("activeUser",'emp');
      }else if(Response[0].user_type==1){
        localStorage.setItem("userID",Response[0].empID);
        localStorage.setItem("userName",Response[0].name);
        localStorage.setItem("activeUser",'admin');
        this.router.navigate(['/operations']);
      }
      this.router.navigate(['/operations']);
    },
     error=>{
       alert("error")
     }
   );
  }
}
