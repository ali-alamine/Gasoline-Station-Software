<?php
class report_model extends CI_Model{

    public function __construct(){
        $this->load->database();
    }

    public function getReportResult($data){
        $fromDateCtrl=$data['fromDateCtrl'];
        $toDateCtrl=$data['toDateCtrl'];
        $selectedEmpId=$data['selectedEmpId'];
       
         // check dates validation
        if($fromDateCtrl ==NULL && $toDateCtrl ==NULL){
            /*START - Get Current Date Time */
           $currentFullDate=getdate();
           $d=$currentFullDate['mday'];
           $m=$currentFullDate['mon'];
           $y=$currentFullDate['year'];
           $time=date("h:i");
           $today_date=$y."-".$m."-".$d."-".$time;
           /*END - Get Current Date Time */
           $fromDate = $today_date;
           $toDate = $today_date;
           $fromDate = new DateTime($fromDateCtrl);
           $toDate = new DateTime($toDateCtrl);
           $fromDateCtrl=$fromDate->format('Y-m-d');
           $toDateCtrl=$toDate->format('Y-m-d');
        }else{
            $fromDate = new DateTime($fromDateCtrl);
            $toDate = new DateTime($toDateCtrl);
            // casting to date object
            $fromDateCtrl=$fromDate->format('Y-m-d');
            $toDateCtrl=$toDate->format('Y-m-d');
        }

        $expenses=$data['expenses'];
        $sell=$data['sell'];
        $debits=$data['debits'];


        if($sell != NULL && $expenses != NULL && $debits != NULL){
            
            // GET ALL SELLING INVOICES

            if($selectedEmpId != NULL){
                $empIDs = "'" .implode("','", $selectedEmpId )."'";
                $condition="empID in (".$empIDs.") AND";
            }else{
                $condition="";
            }

            $query=$this->db->query("SELECT type, sum(amount) as totalSale, sum(totalProfit) as totalProfit 
            FROM invoice WHERE " .$condition." (date(dateTime) <= '$toDateCtrl' and date(dateTime) >= '$fromDateCtrl') AND type NOT IN ('95_d','98_d','dieselG_d','return') GROUP BY type order by totalSale DESC");
            $l=$this->db->last_query();
     
        }
        
        if ($query->num_rows() >= 0) {
            return $query->result();
        } else {
            return 0;
        }
    }

    public function getPaymentReportResult($data){
        $fromDateCtrl=$data['fromDateCtrl'];
        $toDateCtrl=$data['toDateCtrl'];
        $selectedEmpId=$data['selectedEmpId'];
       
         // check dates validation
         if($fromDateCtrl ==NULL && $toDateCtrl ==NULL){
            /*START - Get Current Date Time */
           $currentFullDate=getdate();
           $d=$currentFullDate['mday'];
           $m=$currentFullDate['mon'];
           $y=$currentFullDate['year'];
           $time=date("h:i");
           $today_date=$y."-".$m."-".$d."-".$time;
           /*END - Get Current Date Time */
           $fromDate = $today_date;
           $toDate = $today_date;
           $fromDate = new DateTime($fromDateCtrl);
           $toDate = new DateTime($toDateCtrl);
           $fromDateCtrl=$fromDate->format('Y-m-d');
           $toDateCtrl=$toDate->format('Y-m-d');
        }else{
            $fromDate = new DateTime($fromDateCtrl);
            $toDate = new DateTime($toDateCtrl);
            // casting to date object
            $fromDateCtrl=$fromDate->format('Y-m-d');
            $toDateCtrl=$toDate->format('Y-m-d');
        }

        $expenses=$data['expenses'];
        $sell=$data['sell'];
        $debits=$data['debits'];

       
        if($sell != NULL && $expenses != NULL && $debits != NULL){
            // GET ALL SELLING INVOICES

            if($selectedEmpId != NULL){
                $empIDs = "'" .implode("','", $selectedEmpId )."'";
                $condition="empID in (".$empIDs.") AND";
            }else{
                $condition="";
            }

            // select count(invID), sum(amount) ,note from invoice where type ="payC" group by note

            $query=$this->db->query("SELECT count(invID) AS totalCount, sum(amount) as totalPayments, note as paymentNote FROM invoice
            WHERE " .$condition." type='payC' AND (date(dateTime) <= '$toDateCtrl' AND date(dateTime) >= '$fromDateCtrl') 
            GROUP BY paymentNote order by totalPayments DESC");
            $l=$this->db->last_query();
        }
        
        if ($query->num_rows() >= 0) {
            return $query->result();
        } else {
            return 0;
        }
    }
    
}