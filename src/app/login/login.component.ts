
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { LoginService } from './login.service'; 
import swal from 'sweetalert';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit { 
  userType:object;
  shiftStatus:any;
  empData;
  loginForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl()
  });

  constructor(private loginServ:LoginService,private router: Router) {}

  ngOnInit() {
    // swal("Hello world!");
  }

  checkLogIn(){
    console.log(this.loginForm.value)
    this.loginServ.checkAuth(this.loginForm.value).subscribe(Response=>{
       loginServ => this.userType = loginServ;console.log(Response[0][0])
       /* START -  NO OPEN SHIFT */
       if(Response[0][0] !== undefined){
          if(Response[1][0] === undefined){
            if(Response[0][0].user_type==0){
              localStorage.setItem("userID",Response[0][0].empID);
              localStorage.setItem("activeUser",'emp');
              localStorage.setItem("newShift",'true');
              this.empData={ empName: Response[0][0].name,empID:Response[0][0].empID};
              this.router.navigate(['/startShift'], { queryParams: this.empData});
            }else if(Response[0][0].user_type==1){
              localStorage.setItem("userID",Response[0][0].empID);
              localStorage.setItem("activeUser",'admin');
              localStorage.setItem("newShift",'true');
              this.empData={ empName: Response[0][0].name,empID:Response[0][0].empID};
              this.router.navigate(['/startShift'], { queryParams: this.empData});
            }
            localStorage.setItem("userName",Response[0][0].name);
            
            /* END -  NO OPEN SHIFT */
          }else if(Response[0][0].user_type==1){
            swal({
              title: "Can not start a new shift!",
              text: "Last Shift has not been close yet!, continue as visitor anyway?",
              buttons: {
                noAction: {
                  text:"Cancel",
                  value: "Cancel",
                },
                continue: {
                  text: "Continue as read only",
                  value: "continue",
                },
              },
            })
            .then((value) => {
              switch (value) {
                case "cancel":
                  break;
                case "continue":
                  // swal("rout here with read only param");
                  localStorage.setItem("newShift",'false');
                  this.router.navigate(['/operations']);
                  break;
              }
            });
          }else{
             swal("You don't have permission to start a new shift");
          }
       }else{
         alert("username / password incorrect")
       }
    },
     error=>{
       alert("error")
     }
   );
  }
}
