import { Component, OnInit } from '@angular/core';
import { CountersService } from './counters.service'; 
import { MatFormFieldModule} from '@angular/material/form-field';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-counters',
  templateUrl: './counters.component.html',
  styleUrls: ['./counters.component.scss']
})
export class CountersComponent implements OnInit {
  counters:any;

  gridClasses={
    "1":"tileCol1",
    "2":"tileCol2",
    "3":"tileCol3",
  }

  constructor(private counterServ: CountersService) {}

  ngOnInit() {
    this.getDispansersCounters();
    this.drawDispansers();
  }

  getDispansersCounters(){
      this.counterServ.getAllDispanesersCounters().subscribe( Response=>{
        this.counters = Response;
      }
    );
  }

  drawDispansers(){
  }
}
