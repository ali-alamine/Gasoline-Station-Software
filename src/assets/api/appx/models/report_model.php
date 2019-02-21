<?php
class report_model extends CI_Model{

    public function __construct(){
        $this->load->database();
    }

    public function getReportResult($data){
        $fromDateCtrl=$data['fromDateCtrl'];
        $toDateCtrl=$data['toDateCtrl'];
        $selectedEmpId=$data['selectedEmpId'];
        $expenses=$data['expenses'];
        $sell=$data['sell'];
        $debits=$data['debits'];

        $condition="";

        if($sell == true){
            
            // GET ALL SELLING INVOICES
            $empIDs = "'" .implode("','", $selectedEmpId )."'";

            $this->db->select(" invoice.invID as invID, `item-service`.name as name,invoice.amount as amount,
            invoice.note as note,inv_order.quantity as quantity,invoice.rest as rest,person.full_name as clientName,
            employee.name as empName,employee.user_type as empType,employee.empID as shiftEmpID,
            invoice.totalProfit as profit,invoice.shiftID as shiftID,dateTime,invoice.type as type,
            DATE_FORMAT(dateTime,'%H:%i %p') AS time,invoice.isSupply as isSupply,
            invoice.personID as PID,invoice.fuel_liters as fuel_liters");
            $this->db->from('invoice');
            $this->db->join('inv_order', 'inv_order.invID = invoice.invID','inner');
            $this->db->join('`item-service`', 'inv_order.itemID=`item-service`.itemID','inner');
            $this->db->join('person', 'person.PID=invoice.personID','inner');
            $this->db->join('shift', 'shift.shiftID=invoice.shiftID','inner');
            $this->db->join('employee', 'employee.empID=shift.empID','inner');
            $this->db->where('invoice.type',$type);
            $this->db->where('invoice.isSupply = 0');
            $this->db->where_in('invoice.shiftID',$empIDs);
            $query = $this->db->get();
            return $query->result();      
        }
        
        if ($query->num_rows() > 0) {
            return $query->result_array();
        } else {
            return 0;
        }
    }
    
}