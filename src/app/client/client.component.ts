import { Component, OnInit } from '@angular/core';
import{ ClientService} from './client.service'
import { FormGroup, FormControl } from '@angular/forms';
import {MatSnackBar} from '@angular/material';
declare var $: any;
import 'datatables.net';
import 'datatables.net-bs4';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
 
export class ClientComponent implements OnInit {

  addClientForm = new FormGroup({
    name: new FormControl(''),
    phone: new FormControl(''),
    initDebitAmount: new FormControl(''),
    isClient : new FormControl(1)
  })
  isOpened = 0;
  private clients:any;
  constructor(private clientServ:ClientService,public snackBar: MatSnackBar) { }
  
  ngOnInit() {
    this.getAllClients();
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  togglePanel(index:number) {
    this.isOpened = index;
  }
  collapse() {
    this.isOpened=0;
    this.addClientForm.reset();
  }
  displayTable(){
    setTimeout(function () {$(function () {$('#clientTable').DataTable();});}, 10);  
  }
  addNewClient(){
    this.clientServ.addNewClient(this.addClientForm.value).subscribe(
      Response=>{
        this.openSnackBar(this.addClientForm.value['clientFullName'], "Successfully Added");
        /* START- collapse accordion and rest form values */
        this.isOpened=0;
        this.addClientForm.reset();
        /* END- collapse accordion and rest form values */
      this.getAllClients();
    },
    error=>{
      alert("error");
    });
  }
  getAllClients(){
    this.clientServ.getAllClients().subscribe(Response=>{
      clientServ => this.clients = clientServ; this.clients=Response;
      this.displayTable();
    },
      error=>{
        alert("error")
      });
  }
}
