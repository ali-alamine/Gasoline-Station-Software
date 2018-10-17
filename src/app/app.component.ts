import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';

import { Subscription } from 'rxjs';
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


  constructor(private router: Router) {}

  ngOnInit() {
    
     this.userType=localStorage.getItem('activeUser');
    if(this.userType=='admin'){
      this.isAdmin=true;
    }else{
      this.isAdmin=false
    }
    console.log(this.isAdmin)

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
}