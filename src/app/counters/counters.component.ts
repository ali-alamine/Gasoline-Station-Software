import { Component, OnInit } from '@angular/core';
import { CountersService } from './counters.service'; 
import { MatFormFieldModule} from '@angular/material/form-field';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: 'app-counters',
  templateUrl: './counters.component.html',
  styleUrls: ['./counters.component.scss']
})
export class CountersComponent implements OnInit {
  counters:any;
  modalReference: any;
  index:any;
  gridClasses={
    "1":"tileCol1",
    "2":"tileCol2",
    "3":"tileCol3",
  }

  constructor(private counterServ: CountersService,private modalService: NgbModal,) {}

  ngOnInit() {
    this.getDispansersCounters();
  }

  getDispansersCounters(){
 
      this.counterServ.getAllDispanesersCounters().subscribe( 
        Response=>{
          this.counters = Response;
          console.log(this.counters[1])
      }
      
    );
   
  }

  openCountersModal(countersModal,index) {
    this.index=index;
    this.modalReference = this.modalService.open(countersModal, {
      centered: true,
      ariaLabelledBy: "modal-basic-title"
    });
    // var name = "";
    var colisage = "";
    // this.countersModalTitle = "Ajouter ";

    // if (this.editFlag == true) {
    //   this.countersModalTitle = "Modifier ";
    //   name = StockComponent.selectedRowData["name"];
    //   colisage = StockComponent.selectedRowData["pck_list"];
    // }
    // this.stockForm = this.fb.group({
    //   name: [name, [Validators.required, Validators.minLength(3)]],
    //   colisage: [colisage, [Validators.required]]
    // });
  }
}
