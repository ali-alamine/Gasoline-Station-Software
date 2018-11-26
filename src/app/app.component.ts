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
  totalDrawer;
  shiftID;
  constructor(private router: Router,private location: Location,private ms:MessageServiceService) {}

  ngOnInit() {
    this.shiftID=localStorage.getItem('shiftID');
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
    this.ms.getTotalDarwer(this.shiftID).subscribe(Response => {
      this.totalDrawer = Response[0].total;      
      this.getTotalDarwer();
      this.ms.changeTotal(Response[0].total);
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
    this.getTotalDarwer();
    var username=localStorage.getItem("userName");
    // var drawerAmount=OperationsComponent.this.getTotalDarwer();
    swal({
      title: "التأكيد",
      text:" هل أنت متأكد من أنك تريد إنهاء نوبتك؟"+username ,
      buttons: {
        continue: {
          text: "الخروج",
          value: "continue",
        },
        noAction: {
          text:"إلغاء",
          value: "Cancel",
        },
      },
    })
    .then((value) => {
      switch (value) {
        case "cancel":
          break;
        case "continue":
          let data ={'shiftID' : this.shiftID,'totalDrawer': this.totalDrawer};
          // console.log(data)
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
  getTotalDarwer(){
    this.ms.getTotalDarwer(this.shiftID).subscribe(Response => {
      console.log(Response)
      this.totalDrawer = Response[0].total;
    },
    error=>{
      alert('Error Sum drawer!');
    }
  );

  }
}