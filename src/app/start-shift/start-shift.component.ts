import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { StartShiftService } from './start-shift.service'; 
import swal from 'sweetalert';
@Component({
  selector: 'app-start-shift',
  templateUrl: './start-shift.component.html',
  styleUrls: ['./start-shift.component.scss']
})
export class StartShiftComponent implements OnInit {
  private urlData;
  private empName;
  private empID;
  private empData;
  public startDrawerAmount;
  private shiftData={"empName":"","empID":"","drawerAmount":"","shiftDate":"","timeIn":""};
  constructor(private router: Router,private route: ActivatedRoute,private shiftServ:StartShiftService) { }

  ngOnInit() {
    this.urlData = this.route.queryParams.subscribe(params => {
      this.empData = params || -1;
      
      this.empName=this.empData['empName'];
      this.empID=this.empData['empID'];
    });
  }
  // toLocaleString('en-US', { hour: 'numeric', hour12: true })
  getDateTime(format){
		var d = new Date();
		var minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
		// hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
		hours = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
		ampm = d.getHours() >= 12 ? 'pm' : 'am',
		months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    // days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    if(format=='default'){
      return d.getFullYear()+'-'+months[d.getMonth()]+'-'+d.getDate()+' الساعة ' +hours ;
    }else if(format=='timeOnly'){
      return hours;
    }else if(format=='dateOnly'){
      return d.getFullYear()+'-'+months[d.getMonth()]+'-'+d.getDate();
    }
    
		
  }
  startCancel(){
    this.router.navigate(['/login']);
  }
  startShift(){
    if(this.startDrawerAmount===null || this.startDrawerAmount===undefined){
      this.startDrawerAmount=0;
    }
    this.shiftData={"empName":this.empName,"empID":this.empID,"drawerAmount":this.startDrawerAmount,"shiftDate":this.getDateTime('dateOnly'),"timeIn":this.getDateTime('timeOnly')};
    this.shiftServ.startShift(this.shiftData).subscribe( 
      Response=>{
        var shiftID= Response.toString();
        localStorage.setItem('shiftID',shiftID);
        this.router.navigate(['/operations']);
      },error=>{
        swal("يرجى الاتصال بمطور البرامج الخاص بك");
      }
    );
  }
}
