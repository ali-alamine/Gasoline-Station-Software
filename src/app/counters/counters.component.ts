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
    var canvas = <HTMLCanvasElement> document.getElementById("fuelCont");

    if (canvas.getContext) {

      var ctx = canvas.getContext('2d');
      ctx.fillStyle = "#D74022";
      ctx.fillRect(25, 25, 150, 150);
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.clearRect(60, 60, 120, 120);
      // ctx.strokeRect(90, 90, 80, 80);
      
    }
  }
}
