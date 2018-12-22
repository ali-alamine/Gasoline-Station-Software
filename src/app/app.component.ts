import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { $ } from 'protractor';
import { MessageServiceService } from './message-service.service';
import { OperationsComponent } from './operations/operations.component';
// import { OperationsComponent} from './operations/operations.component';
import swal from 'sweetalert2';
import { debug } from 'util';
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
  mode;
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
        if(this.currentUrl=="/login" || hide=="true" || this.currentUrl=="/" ){
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
    if(this.currentUrl != "/operations"){
      this.location.back();
    }
    
  }
  goHome(){
    var mode=localStorage.getItem('mode');
    if(mode != 'configMode'){
      this.router.navigate(["/operations"]);
    }else{
      this.router.navigate(["/settings"]);
    }
    
  }
  logoutTemp(){
    debugger
    var username=localStorage.getItem("userName");
    // this.getTotalDarwer();
    // debugger
    if(this.drawerAmount != undefined ){
      
      var msg = username + " Are you sure you want to end your shift?" +" " +this.drawerAmount;
      // msg = msg +'<br/> Vous voulez imprimer?';
      swal({
        type: 'warning',
        title: 'Info',
        html: msg,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non',
      }).then((result) => {
        if (result.value) {
          this.ms.logout(this.shiftID).subscribe(Response=>{
          },
          error=>{
            alert("error")
          });
          this.router.navigate(["/login"]);
          localStorage.setItem('userID','-1');
        }
      })
      // swal({
      //   title: "Confirmation",
      //   text: username + " Are you sure you want to end your shift?" +" " +this.drawerAmount ,
      //   buttons: [true, true],                              // booleans
      //   buttons: ['Stay on this page', 'Continue'],         // strings
      //   buttons: [true, 'Delete'], 
      //   buttons: {
      //     continue: {
      //       text: "Logout",
      //       value: "continue",
      //     },
      //     noAction: {
      //       text:"Cancel",
      //       value: "Cancel",
      //     },
      //   },
      // })
      // .then((value) => {
      //   switch (value) {
      //     case "cancel":
      //       break;
      //     case "continue":
      //       this.ms.logout(this.shiftID).subscribe(Response=>{
      //       },
      //       error=>{
      //         alert("error")
      //       });
      //       this.router.navigate(["/login"]);
      //       localStorage.setItem('userID','-1');
      //     break;
      //   }
      // });
    }

  }
  numberWithCommas(x) {
      var parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
  }
  logout(){
    debugger
      this.mode=localStorage.getItem('mode');
      if(this.mode != 'configMode'){
        var username=localStorage.getItem("userName");
        this.shiftID=localStorage.getItem('shiftID');
        this.ms.getTotalDarwer(this.shiftID).subscribe(Response => {
          this.drawerAmount = Response[0].total;
          console.log(this.drawerAmount)
          if(this.drawerAmount != undefined ){
            var drawerAmount=this.numberWithCommas(this.drawerAmount);
            var msg = "<h3 style='color:red'> "+drawerAmount  + " اغلاق حساب الصندوق ب  ل.ل </h3><h1>?</h1>";
            // msg = msg +'<br/> Vous voulez imprimer?';
            swal({
              type: 'warning',
              title: username+' اقفال دوام عمل',
              html: msg,
              showCancelButton: true,
              confirmButtonColor: 'purple',
              cancelButtonColor: 'gray',
              confirmButtonText: 'Continue',
              cancelButtonText: 'Cancel',
            }).then((result) => {
              if (result.value) {
                var data ={'shiftID' : this.shiftID,'totalDrawer':this.drawerAmount};
                console.log(data);
                  this.ms.logout(data).subscribe(Response=>{
                    localStorage.setItem('shiftID','');
                    localStorage.setItem('shiftIDs','');
                    localStorage.setItem('userID','');
                    localStorage.setItem('activeUser','');
                    localStorage.setItem('mode','');
                    this.router.navigate(["/login"]);
                    localStorage.setItem('userID','-1');
                  },
                  error=>{
                    alert("error")
                  });
                  
              }
            })
          }
        },
        error=>{
          swal("contact your software developer");
        }
      );
    }else{
      localStorage.setItem('mode','');
      this.router.navigate(["/login"]);
    }
  }
  
}


