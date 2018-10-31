
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login.service'; 
import { NgbModal } from '../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { formatDate } from '../../../node_modules/@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit { 
  userType:object;
  private modalReference: any;
  @ViewChild('selectModal')
  private selectModal : TemplateRef<any>;
  // private static selectView = 1;
  selectForm;
  sheftDate;

  loginForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
    // sheft_date: new FormControl()
  });

  constructor(private loginServ:LoginService,private router: Router,
    private modalService: NgbModal,private fb: FormBuilder) {}

  ngOnInit() {
    var date = formatDate(new Date(), 'yyyy/MM/dd', 'en');
    if (localStorage.getItem("sheft_date") !== date) {
      localStorage.setItem("sheft_date", date);
      this.sheftDate = date;
    }else{
      this.sheftDate = localStorage.getItem("sheft_date");
    }
    // this.loginForm.get('sheft_date').setValue(this.sheftDate)
    // console.log(this.loginForm.value)
  }

  checkLogIn(){
    this.loginServ.checkAuth(this.loginForm.value).subscribe(Response=>{
      // loginServ => this.userType = loginServ;
      console.log(Response);
      // debugger
      if(Response == "Old shift no closed!"){
        alert(Response);
      }
      if(Response[0].user_type==0){
        localStorage.setItem("userID",Response[0].empID);
        localStorage.setItem("userName",Response[0].name);
        localStorage.setItem("activeUser",'emp');
        localStorage.setItem("newShift",'');
        this.router.navigate(['/operations']);
      }else if(Response[0].user_type==1){
        localStorage.setItem("userID",Response[0].empID);
        localStorage.setItem("userName",Response[0].name);
        localStorage.setItem("activeUser",'admin');
        this.modalReference = this.modalService.open(this.selectModal, {
          centered: true,
          ariaLabelledBy: "modal-basic-title"
        });
        this.selectForm = this.fb.group({
          selectView : ['newShift']
        })
      }
    },
    error=>{
      alert('Error user or pass. Try again.')
    }
  );
}
  getRouter(){
    this.modalReference.close();
        localStorage.setItem("newShift",this.selectForm.get('selectView').value);
        this.router.navigate(['/operations']);
  }
  get selectView (){
    return this.loginForm.get('selectView');
  }
}
