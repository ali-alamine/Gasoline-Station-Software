import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { $ } from 'protractor';
import { MessageServiceService } from './message-service.service';
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
        this.currentUrl = event.url;
        // if(this.currentUrl=="/login" || this.currentUrl=="/operations" || this.currentUrl=="/counters" || this.currentUrl=="/selllub" || this.currentUrl=="/wash"){
          // (<HTMLElement>document.querySelector('#sideBarNav')).style.display = 'none';
          // (<HTMLElement>document.querySelector('#content')).style.padding = '0px';
        // }
        // else if(this.currentUrl=="/stock"){
          // (<HTMLElement>document.querySelector('#content')).style.padding = '100px';
          // (<HTMLElement>document.querySelector('#tabs')).style.marginTop = '-90px';
          // (<HTMLElement>document.querySelector('#sideBarNav')).style.display = 'inline';
        // }
      // }
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
    this.router.navigate(["/login"]);
    localStorage.setItem('userID','-1');
  }
}