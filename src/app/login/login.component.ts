
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { LoginService } from './login.service'; 
import { AuthenticationService } from '../../service/authentication.service';
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

  constructor(private loginServ:LoginService,private router: Router,public authServ:AuthenticationService) {}

  ngOnInit() {
    
  }

  checkLogIn(){
    debugger;
    var isLoggedOut=localStorage.getItem('shiftID');
    // if(isLoggedOut == ''){
      console.log(this.loginForm.value)
      this.loginServ.checkAuth(this.loginForm.value).subscribe(Response=>{
         loginServ => this.userType = loginServ;
         console.log(Response[0][0])
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
              var currentUserID=localStorage.getItem('userID');
              if(currentUserID==Response[0][0].empID){
                // alert("same");
                var loggedUsername = localStorage.getItem('userName');
                swal({
                  title: "Your last login is not yet closed",
                  text:"This entry will be considered a continuation of your previous employment." +loggedUsername +"",
                  buttons: {
                    continue: {
                      text: "continue",
                      value: "continue",
                    },
                  },
                })
                .then((value) => {
                  switch (value) {
                    case "cancel":
                      break;
                    case "continue":
                    localStorage.setItem('newShift','true');
                    this.router.navigate(['/operations']);
                      break;
                  }
                });
              }else{
                // alert("diff")
                var loggedUsername = localStorage.getItem('userName');
              swal({
                title: "You can't start a new shift!",
                text: "It's not closed yet, continue as a visitor?" +loggedUsername +"",
                buttons: {
                  noAction: {
                    text:"Cancel",
                    value: "Cancel",
                  },
                  continue: {
                    text: "Continue reading only",
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
                    localStorage.setItem('mode','configMode');
                    this.router.navigate(['/settings']);
                    break;
                }
              });
            }
            }else{
                var currentUserID=localStorage.getItem('userID');
                if(currentUserID==Response[0][0].empID){
                  // alert("same");
                  var loggedUsername = localStorage.getItem('userName');
                  swal({
                    title: "Your last login is not yet closed",
                    text: "This entry will be considered a continuation of your previous employment," +loggedUsername +"",
                    buttons: {
                      continue: {
                        text: "tracking",
                        value: "continue",
                      },
                    },
                  })
                  .then((value) => {
                    switch (value) {
                      case "cancel":
                        break;
                      case "continue":
                        
                      localStorage.setItem('newShift','true');
                      this.router.navigate(['/operations']);
                        break;
                    }
                  });
                }else{
                  var loggedUsername = localStorage.getItem('userName');
                   swal("He hasn't closed his business yet" +loggedUsername +"");
                }
              //  this.router.navigate(['/operations']);
            }
         }else{
           alert("Username / password incorrect")
         }
      },
       error=>{
         alert("error am confused Loop")
       }
     );
    // }else{
    //   localStorage.setItem('newShift','true');
    //   this.router.navigate(['/operations']);
    // }
   
  }
}
