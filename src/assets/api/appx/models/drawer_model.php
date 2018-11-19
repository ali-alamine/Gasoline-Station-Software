<?php
class drawer_model extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }

    public function getTotalDarwer($date,$shiftID)
    {
        $query = $this->db->query("select
        (shift.initDrawer +  IFNULL(tableSumLub.totalLub,0) +  IFNULL(tableSumAcc.totalAcc,0) +  IFNULL(tableSumWash.totalWash,0) +
         IFNULL(tableSumReturn.totalReturn,0) + IFNULL(tableSumFuel.totalFuel,0) + IFNULL(tableSumFuel_d.totalFuel_d,0) - 
         IFNULL(tableSumPayC.totalPayC,0) ) as total from shift 
        left join 
        (select coalesce(sum(amount-rest),0) as totalLub,date(dateTime) as date1 FROM invoice WHERE type = 'lub' and isSupply= 0 
        and date(dateTime)  = '".$date."' and shiftID = '".$shiftID."' ) as tableSumLub on shift.shift_date = tableSumLub.date1
        left join 
        (select coalesce(sum(amount-rest),0) as totalAcc,date(dateTime) as date2 FROM invoice WHERE type = 'access' and isSupply= 0 
        and date(dateTime)  = '".$date."' and shiftID = '".$shiftID."' ) as tableSumAcc on shift.shift_date = tableSumAcc.date2
        left join 
        (select coalesce(sum(amount-rest),0) as totalWash,date(dateTime) as date3 FROM invoice WHERE type = 'wash' and isSupply= 0 
        and date(dateTime)  = '".$date."' and shiftID = '".$shiftID."' ) as tableSumWash on shift.shift_date = tableSumWash.date3
        left join 
        (select coalesce(sum(amount),0) as totalReturn,date(dateTime) as date4 FROM invoice WHERE type = 'return' and isSupply= 0 
        and date(dateTime) = '".$date."' and shiftID = '".$shiftID."' ) as tableSumReturn on shift.shift_date = tableSumReturn.date4
        left join 
        (select coalesce(sum(amount),0) as totalPayC,date(dateTime) as date5 FROM invoice WHERE type = 'payC' and isSupply= 0 
        and date(dateTime)  = '".$date."' and shiftID = '".$shiftID."'  ) as tableSumPayC on shift.shift_date = tableSumPayC.date5
        left join 
        (select coalesce(sum(amount),0) as totalFuel,date(dateTime) as date6 FROM invoice WHERE  
        type in ('Diesel G','Diesel R','95','98') and isSupply= 0 
        and date(dateTime)  = '".$date."' and shiftID = '".$shiftID."'  ) as tableSumFuel on shift.shift_date = tableSumFuel.date6
        left join 
        (select coalesce(sum(amount-rest),0) as totalFuel_d,date(dateTime) as date7 FROM invoice WHERE  
        type in ('98_d','95_d','dieselG_d','dieselR_d') and isSupply= 0 
        and date(dateTime)  = '".$date."' and shiftID = '".$shiftID."'  ) as tableSumFuel_d on shift.shift_date = tableSumFuel_d.date7
        where shift.shift_date = '".$date."' and shift.shiftID = '".$shiftID."' ");
         if ($query->num_rows() > 0) {
            return $query->result_array();
        } else {
            return 0;
        }

    }
  
}
