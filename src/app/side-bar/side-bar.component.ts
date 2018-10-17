import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';
// import { SharedData } from '../shared-data';
import { Observable } from 'rxjs';
// import { LoginService } from '../login/login.service';


@Component({
  selector: 'side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  currentUrl: string;
  // isLoggedIn: Observable<boolean>; 
  constructor(private router: Router) { 
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
  });

  // this.isLoggedIn = this.loginService.isLoggedIn;
  }

  onLogout(){
    // this.loginService.logout();
  }

}
