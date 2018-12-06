import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { $ } from 'protractor';
import { MessageServiceService } from './message-service.service';
import { OperationsComponent } from './operations/operations.component';
// import { OperationsComponent} from './operations/operations.component';
import swal from 'sweetalert2';
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
  shiftID:any;
  drawerAmount:any;
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
  logoutTemp(){
    var username=localStorage.getItem("userName");
    // this.getTotalDarwer();
    // debugger
    if(this.drawerAmount != undefined ){
      swal({
        title: "Confirmation",
        text: username + " Are you sure you want to end your shift?" +" " +this.drawerAmount ,
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
            this.ms.logout(this.shiftID).subscribe(Response=>{
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
  numberWithCommas(x) {
      var parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
  }
  logout(){
    var username=localStorage.getItem("userName");
    this.shiftID=localStorage.getItem('shiftID');
    this.ms.getTotalDarwer(this.shiftID).subscribe(Response => {
      this.drawerAmount = Response[0].total;
      console.log(this.drawerAmount)
      if(this.drawerAmount != undefined ){
        // var text = document.createElement('div');
        var drawerAmount=this.numberWithCommas(this.drawerAmount);
        // text.innerHTML=username + " Are you sure you want to end your shift?" +" " +"<h1 style='color:firebrick'> " + drawerAmount +" </h1>";
        swal({
          title: "Confirmation",
          text:"text",
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
            console.log(this.drawerAmount)
            var data ={'shiftID' : this.shiftID,'totalDrawer':this.drawerAmount};
            console.log(data)
              this.ms.logout(data).subscribe(Response=>{
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
    },
    error=>{
      swal("contact your software developer");
    }
  );
  }
}