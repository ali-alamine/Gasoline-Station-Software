<?php
class drawer_model extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }

    public function getTotalDarwer($date,$empID)
    {
        $query = $this->db->query("select
        (drawer.amount +  IFNULL(tableSumLub.totalLub,0) +  IFNULL(tableSumAcc.totalAcc,0) +  IFNULL(tableSumWash.totalWash,0) + IFNULL(tableSumReturn.totalReturn,0) - IFNULL(tableSumPayC.totalPayC,0) ) as total from drawer 
        left join (select coalesce(sum(amount-rest),0) as totalLub,date(dateTime) as date1 FROM invoice WHERE type = 'lub' and isSupply= 0 and date(dateTime)  = '".$date."' and empID = '".$empID."' ) as tableSumLub on drawer.date = tableSumLub.date1
        left join (select coalesce(sum(amount-rest),0) as totalAcc,date(dateTime) as date2 FROM invoice WHERE type = 'access' and isSupply= 0 and date(dateTime)  = '".$date."' and empID = '".$empID."' ) as tableSumAcc on drawer.date = tableSumAcc.date2
        left join (select coalesce(sum(amount-rest),0) as totalWash,date(dateTime) as date3 FROM invoice WHERE type = 'wash' and isSupply= 0 and date(dateTime)  = '".$date."' and empID = '".$empID."' ) as tableSumWash on drawer.date = tableSumWash.date3
        left join (select coalesce(sum(amount),0) as totalReturn,date(dateTime) as date4 FROM invoice WHERE type = 'return' and isSupply= 0 and date(dateTime) = '".$date."' and empID = '".$empID."' ) as tableSumReturn on drawer.date = tableSumReturn.date4
        left join (select coalesce(sum(amount),0) as totalPayC,date(dateTime) as date5 FROM invoice WHERE type = 'payC' and isSupply= 0 and date(dateTime)  = '".$date."' and empID = '".$empID."'  ) as tableSumPayC on drawer.date = tableSumPayC.date5
        where drawer.date = '".$date."' ");
         if ($query->num_rows() > 0) {
            return $query->result_array();
        } else {
            return 0;
        }

    }
  
}
