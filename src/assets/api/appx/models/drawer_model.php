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
         IFNULL(tableSumReturn.totalReturn,0) + IFNULL(tableSumFuel.totalFuel,0) + IFNULL(tableSumFuel_d.totalFuel_d,0)) - 
         IFNULL(tableSumPayC.totalPayC,0)  as total from shift 
        left join 
        (select coalesce(sum(amount-rest),0) as totalLub,shiftID as shiftID1 FROM invoice WHERE type = 'lub' and isSupply= 0 
        and shiftID = '".$shiftID."' ) as tableSumLub on shift.shiftID = tableSumLub.shiftID1
        left join 
        (select coalesce(sum(amount-rest),0) as totalAcc,shiftID as shiftID2 FROM invoice WHERE type = 'access' and isSupply= 0 
        and shiftID = '".$shiftID."' ) as tableSumAcc on shift.shiftID = tableSumAcc.shiftID2
        left join 
        (select coalesce(sum(amount-rest),0) as totalWash,shiftID as shiftID3 FROM invoice WHERE type = 'wash' and isSupply= 0 
        and shiftID = '".$shiftID."' ) as tableSumWash on shift.shiftID = tableSumWash.shiftID3
        left join 
        (select coalesce(sum(amount),0) as totalReturn,shiftID as shiftID4 FROM invoice WHERE type = 'return' and isSupply= 0 
        and shiftID = '".$shiftID."' ) as tableSumReturn on shift.shiftID = tableSumReturn.shiftID4
        left join 
        (select coalesce(sum(amount),0) as totalPayC,shiftID as shiftID5 FROM invoice WHERE type = 'payC' and isSupply= 0 
        and shiftID = '".$shiftID."'  ) as tableSumPayC on shift.shiftID = tableSumPayC.shiftID5
        left join 
        (select coalesce(sum(amount),0) as totalFuel,shiftID as shiftID6 FROM invoice WHERE  
        type in ('Diesel G','Diesel R','95','98') and isSupply= 0 
        and shiftID = '".$shiftID."'  ) as tableSumFuel on shift.shiftID = tableSumFuel.shiftID6
        left join 
        (select coalesce(sum(amount-rest),0) as totalFuel_d,shiftID as shiftID7 FROM invoice WHERE  
        type in ('98_d','95_d','dieselG_d','dieselR_d') and isSupply= 0 
        and shiftID = '".$shiftID."'  ) as tableSumFuel_d on shift.shiftID = tableSumFuel_d.shiftID7
        where shift.shiftID = '".$shiftID."' ");
         if ($query->num_rows() > 0) {
            return $query->result_array();
        } else {
            return 0;
        }

    }
  
}
