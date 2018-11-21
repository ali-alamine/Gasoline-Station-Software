<?php
class invoice_model extends CI_Model{
    public function __construct(){
        $this->load->database();
    }
    /* Get All Invoice filter by type */
    public function selectAll_byType(){
        $this->db->select("*");
        $this->db->from("item-service");
        $this->db->where("item_type","lub");
        $this->db->order_by("itemID", "DESC");
        $query = $this->db->get();
        $st=$this->db->last_query();
        return $query->result();
    }
    /* Get All Invoice filter by type and shiftIDs */
    public function getDetailInvoice($type,$shiftIDs){
        
        if($type == 'debits'){
            $shiftID = "'" .implode("','", $shiftIDs  ) . "'";
            $query = $this->db->query("SELECT * from((select invoice.rest as rest,person.full_name as clientName,
            `item-service`.name as name,invoice.amount as amount,
            invoice.note as note,inv_order.quantity as quantity,invoice.type as type,
            employee.name as empName,employee.user_type as empType,employee.empID as shiftEmpID,invoice.totalProfit as profit
            FROM invoice 
            left JOIN inv_order on inv_order.invID=invoice.invID 
            left JOIN `item-service` on inv_order.itemID=`item-service`.itemID
            left JOIN person on person.PID=invoice.personID 
            left JOIN shift on shift.shiftID=invoice.shiftID 
            left JOIN employee on employee.empID=shift.empID 
            WHERE type in ('access','lub') and invoice.shiftID in ($shiftID)
            and invoice.isSupply = 0 and invoice.rest > 0 ) 
            UNION (
                select invoice.rest as rest,person.full_name as clientName,
                    null as name,invoice.amount as amount,
                    invoice.note as note,null as quantity,invoice.type as type,
                    employee.name as empName,employee.user_type as empType,employee.empID as shiftEmpID,invoice.totalProfit as profit
                    FROM invoice 
                    left JOIN person on person.PID=invoice.personID 
                    left JOIN shift on shift.shiftID=invoice.shiftID 
                    left JOIN employee on employee.empID=shift.empID 
                    WHERE type in ('wash') and invoice.shiftID in ($shiftID) 
                    and invoice.isSupply = 0 and invoice.rest > 0
            ))as table1");
        } 
        elseif($type == 'lub' || $type == 'access'){
            $this->db->select(" invoice.invID, `item-service`.name as name,invoice.amount as amount,
            invoice.note as note,inv_order.quantity as quantity,invoice.rest as rest,person.full_name as clientName,
            employee.name as empName,employee.user_type as empType,employee.empID as shiftEmpID,invoice.totalProfit as profit,invoice.shiftID as shiftID");
            $this->db->from('invoice');
            $this->db->join('inv_order', 'inv_order.invID = invoice.invID','inner');
            $this->db->join('`item-service`', 'inv_order.itemID=`item-service`.itemID','inner');
            $this->db->join('person', 'person.PID=invoice.personID','inner');
            $this->db->join('shift', 'shift.shiftID=invoice.shiftID','inner');
            $this->db->join('employee', 'employee.empID=shift.empID','inner');
            $this->db->where('invoice.type',$type);
            $this->db->where('invoice.isSupply = 0');
            $this->db->where_in('invoice.shiftID',$shiftIDs);
            $query = $this->db->get();
            return $query->result();
        } 
        else
        if($type == 'wash' || $type == 'return'){
            $this->db->select(" invoice.invID,invoice.amount as amount,invoice.note as note,
            invoice.rest as rest,person.full_name as clientName,
            employee.name as empName,employee.user_type as empType,employee.empID as shiftEmpID,invoice.totalProfit as profit");
            $this->db->from('invoice');
            $this->db->join('person', 'person.PID=invoice.personID','inner');
            $this->db->join('shift', 'shift.shiftID=invoice.shiftID','inner');
            $this->db->join('employee', 'employee.empID=shift.empID','inner');
            $this->db->where('invoice.type',$type);
            $this->db->where('invoice.isSupply = 0');
            $this->db->where_in('invoice.shiftID',$shiftIDs);
            $query = $this->db->get();
            // return $query->result();
        } else
        if($type == 'payC'){
            $this->db->select(" invoice.invID,invoice.amount as amount,invoice.note as note,
            invoice.rest as rest,
            employee.name as empName,employee.user_type as empType,employee.empID as shiftEmpID,invoice.totalProfit as profit");
            $this->db->from('invoice');
            $this->db->join('shift', 'shift.shiftID=invoice.shiftID','inner');
            $this->db->join('employee', 'employee.empID=shift.empID','inner');
            $this->db->where('invoice.type',$type);
            $this->db->where('invoice.isSupply = 0');
            $this->db->where_in('invoice.shiftID',$shiftIDs);
            $query = $this->db->get();
            // return $query->result();
        }else if ($type == 'supply'){
            $this->db->select(" invoice.invID, invoice.amount as amount,
            invoice.rest as rest,person.full_name as clientName,`item-service`.name as name,
            inv_order.quantity as quantity,employee.name as empName,employee.user_type as empType,employee.empID as shiftEmpID");
            $this->db->from('invoice');
            $this->db->join('inv_order', 'inv_order.invID = invoice.invID','inner');
            $this->db->join('`item-service`', 'inv_order.itemID=`item-service`.itemID','inner');
            $this->db->join('person', 'person.PID=invoice.personID','inner');
            $this->db->join('shift', 'shift.shiftID=invoice.shiftID','inner');
            $this->db->join('employee', 'employee.empID=shift.empID','inner');
            $this->db->where_in('invoice.type',array('access','lub'));
            $this->db->where('invoice.isSupply = 1');
            $this->db->where_in('invoice.shiftID',$shiftIDs);
            $query = $this->db->get();
            return $query->result();
        }else if ($type =='allType'){
            $shiftID = "'" .implode("','", $shiftIDs  ) . "'";
            
            $query = $this->db->query("select * from((select DATE_FORMAT(dateTime,'%H:%i %p') AS time,person.full_name as clientName,
            `item-service`.name as name,inv_order.quantity as quantity,
            employee.name as empName,employee.user_type as empType,
            employee.empID as shiftEmpID,IFNULL(invoice.totalProfit,0)  as profit,shift.shiftID as shiftID,invoice.type as type,
            invoice.amount as amount,invoice.rest as rest,invoice.isSupply as isSupply
            FROM invoice 
            left JOIN inv_order on inv_order.invID=invoice.invID 
            left JOIN `item-service` on inv_order.itemID=`item-service`.itemID
            left JOIN person on person.PID=invoice.personID 
            left JOIN shift on shift.shiftID=invoice.shiftID
            left JOIN employee on employee.empID=shift.empID 
            WHERE type in ('access','lub') and invoice.shiftID in ($shiftID))
            UNION (
                select DATE_FORMAT(dateTime,'%H:%i %p') AS time,person.full_name as clientName,
                null as name,invoice.fuel_liters as quantity,
                employee.name as empName,employee.user_type as empType,
                employee.empID as shiftEmpID,IFNULL(invoice.totalProfit,0)  as profit,shift.shiftID as shiftID,invoice.type as type,
                invoice.amount as amount,invoice.rest as rest,invoice.isSupply as isSupply
                    FROM invoice 
                    left JOIN person on person.PID=invoice.personID 
                    left JOIN shift on shift.shiftID=invoice.shiftID
                    left JOIN employee on employee.empID=shift.empID 
                    WHERE type in ('wash','payC','return','Diesel G','Diesel R','95','98','98_d','95_d','dieselG_d','dieselR_d')
                     and invoice.shiftID in ($shiftID)
                     ))as table1
                   ");
        }
        
        if ($query->num_rows() > 0) {
            return $query->result_array();
        } else {
            return 0;
        }
    }
    /* Get All Invoice filter by type and shiftID */
    public function getShiftTypeDetails($type,$shiftID){
        if($type == 'debits'){
            $query = $this->db->query("select * from
            ((select invoice.rest as rest,person.full_name as clientName, `item-service`.name as name,invoice.amount as amount, 
            invoice.note as note,inv_order.quantity as quantity,invoice.type as type, employee.name as empName,
            employee.user_type as empType,employee.empID as shiftEmpID, invoice.totalProfit as profit,
            shift.shiftID as shiftID,DATE_FORMAT(dateTime,'%H:%i %p') AS time 
             FROM invoice 
             left JOIN inv_order on inv_order.invID=invoice.invID 
             left JOIN `item-service` on inv_order.itemID=`item-service`.itemID 
             left JOIN person on person.PID=invoice.personID 
             left JOIN shift on shift.shiftID=invoice.shiftID 
             left JOIN employee on employee.empID=shift.empID 
             WHERE type in ('access','lub') and invoice.isSupply = 0 and invoice.rest > 0 and invoice.shiftID ='".$shiftID."') 
             UNION 
             ( select invoice.rest as rest,person.full_name as clientName, null as name,invoice.amount as amount, 
             invoice.note as note,null as quantity,invoice.type as type, employee.name as empName,
             employee.user_type as empType,employee.empID as shiftEmpID, invoice.totalProfit as profit,
             shift.shiftID as shiftID,DATE_FORMAT(dateTime,'%H:%i %p') AS time 
              FROM invoice 
              left JOIN person on person.PID=invoice.personID 
              left JOIN shift on shift.shiftID=invoice.shiftID 
              left JOIN employee on employee.empID=shift.empID 
              WHERE type in ('wash','98_d','95_d','dieselG_d','dieselR_d') and invoice.isSupply = 0 and invoice.rest > 0 and invoice.shiftID ='".$shiftID."'))as table1 ");
        } 
        elseif($type == 'lub' || $type == 'access'){
            
            $this->db->select(" `item-service`.name as name,invoice.amount as amount,invoice.empID as ids,dateTime as datetime,
            invoice.note as note,inv_order.quantity as quantity,invoice.rest as rest,person.full_name as clientName,
            employee.name as empName,employee.user_type as empType,
            employee.empID as shiftEmpID,invoice.totalProfit as profit,shift.shiftID as shiftID,DATE_FORMAT(dateTime,'%H:%i %p') AS time");
            $this->db->from('invoice');
            $this->db->join('inv_order', 'inv_order.invID = invoice.invID','inner');
            $this->db->join('`item-service`', 'inv_order.itemID=`item-service`.itemID','inner');
            $this->db->join('person', 'person.PID=invoice.personID','inner');
            $this->db->join('shift', 'shift.shiftID=invoice.shiftID','inner');
            $this->db->join('employee', 'employee.empID=shift.empID','inner');
            $this->db->where('invoice.shiftID',$shiftID);
            $this->db->where('invoice.type',$type);
            $this->db->where('invoice.isSupply = 0');
            
            $query = $this->db->get();
            $sql = $this->db->last_query();
        } 
        else if($type == 'wash' || $type == 'return'){
            $this->db->select(" invoice.amount as amount,invoice.note as note,
            invoice.rest as rest,person.full_name as clientName,
            employee.name as empName,employee.user_type as empType,invoice.totalProfit as profit,DATE_FORMAT(dateTime,'%H:%i %p') AS time");
            $this->db->from('invoice');
            $this->db->join('person', 'person.PID=invoice.personID','inner');
            $this->db->join('shift', 'shift.shiftID=invoice.shiftID','inner');
            $this->db->join('employee', 'employee.empID=shift.empID','inner');
            $this->db->where('invoice.shiftID',$shiftID);
            $this->db->where('invoice.type',$type);
            $this->db->where('invoice.isSupply = 0');
            $query = $this->db->get();
        } else if($type == 'payC'){
            $this->db->select(" invoice.amount as amount,invoice.note as note,
            invoice.rest as rest,
            employee.name as empName,employee.user_type as empType,invoice.totalProfit as profit,DATE_FORMAT(dateTime,'%H:%i %p') AS time");
            $this->db->from('invoice');
            $this->db->join('shift', 'shift.shiftID=invoice.shiftID','inner');
            $this->db->join('employee', 'employee.empID=shift.empID','inner');
            $this->db->where('invoice.shiftID',$shiftID);
            $this->db->where('invoice.type',$type);
            $this->db->where('invoice.isSupply = 0');
            $query = $this->db->get();
        } else if ($type == 'supply'){
            $this->db->select(" invoice.amount as amount,
            invoice.rest as rest,person.full_name as clientName,`item-service`.name as name,
            inv_order.quantity as quantity,
            employee.name as empName,employee.user_type as empType,employee.empID as shiftEmpID,DATE_FORMAT(dateTime,'%H:%i %p') AS time");
            $this->db->from('invoice');
            $this->db->join('inv_order', 'inv_order.invID = invoice.invID','inner');
            $this->db->join('`item-service`', 'inv_order.itemID=`item-service`.itemID','inner');
            $this->db->join('person', 'person.PID=invoice.personID','inner');
            $this->db->join('shift', 'shift.shiftID=invoice.shiftID','inner');
            $this->db->join('employee', 'employee.empID=shift.empID','inner');
            $this->db->where('invoice.shiftID',$shiftID);
            $this->db->where_in('invoice.type',array('access','lub'));
            $this->db->where('invoice.isSupply = 1');
            $query = $this->db->get();
        }else if ($type =='allType'){
            $query = $this->db->query("select * from((select DATE_FORMAT(dateTime,'%H:%i %p') AS time,person.full_name as clientName,
            `item-service`.name as name,inv_order.quantity as quantity,
            employee.name as empName,employee.user_type as empType,
            employee.empID as shiftEmpID,IFNULL(invoice.totalProfit,0)  as profit,shift.shiftID as shiftID,invoice.type as type,
            invoice.amount as amount,invoice.rest as rest,invoice.isSupply as isSupply
            FROM invoice 
            left JOIN inv_order on inv_order.invID=invoice.invID 
            left JOIN `item-service` on inv_order.itemID=`item-service`.itemID
            left JOIN person on person.PID=invoice.personID 
            left JOIN shift on shift.shiftID=invoice.shiftID
            left JOIN employee on employee.empID=shift.empID 
            WHERE type in ('access','lub') and invoice.shiftID ='".$shiftID."')
            UNION (
                select DATE_FORMAT(dateTime,'%H:%i %p') AS time,person.full_name as clientName,
                null as name,invoice.fuel_liters as quantity,
                employee.name as empName,employee.user_type as empType,
                employee.empID as shiftEmpID,IFNULL(invoice.totalProfit,0)  as profit,shift.shiftID as shiftID,invoice.type as type,
                invoice.amount as amount,invoice.rest as rest,invoice.isSupply as isSupply
                    FROM invoice 
                    left JOIN person on person.PID=invoice.personID 
                    left JOIN shift on shift.shiftID=invoice.shiftID
                    left JOIN employee on employee.empID=shift.empID 
                    WHERE type in ('wash','payC','return','Diesel G','Diesel R','95','98','98_d','95_d','dieselG_d','dieselR_d') and invoice.shiftID ='".$shiftID."'))as table1
                   ");
        }else if($type == "counters"){
            $query = $this->db->query("       
            SELECT `invoice`.`invID`, `invoice`.`amount` as `amount`,
            `invoice`.`note` as `note`,`invoice`.`fuel_liters` as `quantity`, 
            `invoice`.`rest` as `rest`, `person`.`full_name` as `clientName`, 
            `employee`.`name` as `empName`, `employee`.`user_type` as `empType`, 
            `employee`.`empID` as `shiftEmpID`, `invoice`.`totalProfit` as `profit`, 
            `invoice`.`shiftID` as `shiftID`, `invoice`.`type` as `type`,DATE_FORMAT(dateTime,'%H:%i %p') AS time
            FROM `invoice` 
            left JOIN `person` ON `person`.`PID`=`invoice`.`personID` 
            left JOIN `shift` ON `shift`.`shiftID`=`invoice`.`shiftID` 
            left JOIN `employee` ON `employee`.`empID`=`shift`.`empID`  
            WHERE `invoice`.`type` IN('Diesel G','Diesel R','95','98','98_d','95_d','dieselG_d','dieselR_d') 
            AND `invoice`.`isSupply` = 0 AND `invoice`.`shiftID` = '".$shiftID."'
                    ");
            // $this->db->select(" invoice.invID,invoice.amount as amount,
            // invoice.note as note,counter.counter_1_quan as quantity1,counter.counter_2_quan as quantity2,
            // invoice.rest as rest,person.full_name as clientName,
            // employee.name as empName,employee.user_type as empType,employee.empID as shiftEmpID,
            // invoice.totalProfit as profit,invoice.shiftID as shiftID,invoice.type as type,counter.counterID as counterID'");
            // $this->db->from('invoice');
            // $this->db->join('person', 'person.PID=invoice.personID','inner');
            // $this->db->join('shift', 'shift.shiftID=invoice.shiftID','inner');
            // $this->db->join('employee', 'employee.empID=shift.empID','inner');
            // $this->db->join('counter', 'counter.counterID=invoice.counterID','inner');
            // $this->db->where_in('invoice.type','`Diesel G`,`Diesel R`,95,98,98_d,95_d,dieselG_d,dieselR_d');
            // $this->db->where('invoice.isSupply = 0');
            // $this->db->where('invoice.shiftID',$shiftID);
            // $query = $this->db->get();
            // return $query->result();
        }
        if ($query->num_rows() > 0) {
            return $query->result_array();
        } else {
            return 0;
        }
    }
    /* Get All shift filter by  date and shiftID */
    public function getShiftDetails($shiftID,$fromExpDate,$toExpDate){
        $this->db->select('*');
        $this->db->from('shift');
        $this->db->join('employee', 'employee.empID=shift.empID','inner');
        $this->db->where_in('shift.empID',$shiftID);
        $this->db->where("shift.shift_date BETWEEN '".$fromExpDate."' and '".$toExpDate."'");
        $this->db->order_by("shiftID", "ASC");
        // $this->db->limit($offset, $limit);
        $query = $this->db->get();
        $st=$this->db->last_query();
        return $query->result(); 
    }
    /* Get the total shift  filter by empId and date */
    public function countShiftDetails($empIDs,$fromExpDate,$toExpDate){
        $ids = array();
        foreach ($empIDs as $id)
        {
            $ids[] = $id;
        }
        $this->db->select("count(shiftID) as total");
        $this->db->from('shift');
        $this->db->join('employee', 'employee.empID=shift.empID','inner');
        $this->db->where("shift.shift_date BETWEEN '".$fromExpDate."' and '".$toExpDate."'");
        $this->db->where_in('shift.empID',$ids);
        $this->db->order_by("shiftID", "DESC");
        $query = $this->db->get();
        $st=$this->db->last_query();
        return $query->result();
    }
}