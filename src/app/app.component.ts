import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { $ } from 'protractor';
import { MessageServiceService } from './message-service.service';
import { OperationsComponent } from './operations/operations.component';
// import { OperationsComponent} from './operations/operations.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'app';
  currentUrl: string;
  userType:string;
  isAdmin:boolean;


  constructor(private router: Router,private location: Location,private ms:MessageServiceService) {}

  ngOnInit() {
    // (<HTMLElement>document.querySelector('#header')).style.display = 'none';
    this.checkOpenedSession();
     this.userType=localStorage.getItem('activeUser');

    if(this.userType=='admin'){
      this.isAdmin=true;
    }else{
      this.isAdmin=false
    }

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // alert("oirog")
        this.currentUrl = event.url;
        if(this.currentUrl.includes('startShift')){
          var hide="true";
        }else{ hide= 'false'}
        if(this.currentUrl=="/login" || hide=="true"){
          (<HTMLElement>document.querySelector('#header')).style.display = 'none';
        }
        else{
          (<HTMLElement>document.querySelector('#header')).style.display = 'block';
        }
      }
    });

  }

  checkOpenedSession(){
    this.ms.getActiveSessions().subscribe(Response=>{
      if(Response != ''){
        // alert('1');
      }else{
        // alert('0')
      }
    },
    error=>{
      alert("error")
    });
  }

  goBack(){
    this.location.back();
  }
  goHome(){
    this.router.navigate(["/operations"]);
  }
  logout(){
    var username=localStorage.getItem("userName");
    // var drawerAmount=OperationsComponent.this.getTotalDarwer();
    swal({
      title: "Confirmation",
      text: username + " Are you sure you want to end your shift?" ,
      buttons: {
        continue: {
          text: "Logout",
          value: "continue",
        },
        noAction: {
          text:"Cancel",
          value: "Cancel",
        },
      },
    })
    .then((value) => {
      switch (value) {
        case "cancel":
          break;
        case "continue":
          let id=localStorage.getItem('shiftID');
          // alert(id);
          // OperationsComponent.getTotalDarwer();
          OperationsComponent.staticTotalDrawer;
          console.log(OperationsComponent.staticTotalDrawer)
          let data ={'shiftID' : id,'totalDrawer': OperationsComponent.staticTotalDrawer};
          this.ms.logout(data).subscribe(Response=>{
            // alert('1')
          },
          error=>{
            alert("error")
          });
          this.router.navigate(["/login"]);
          localStorage.setItem('userID','-1');
        break;
      }
    });
  }
}