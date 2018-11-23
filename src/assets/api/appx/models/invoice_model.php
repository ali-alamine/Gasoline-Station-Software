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
            $query = $this->db->query("select * from((select invoice.rest as rest,person.full_name as clientName,
            `item-service`.name as name,invoice.amount as amount,
            invoice.note as note,inv_order.quantity as quantity,invoice.type as type,
            employee.name as empName,employee.user_type as empType,employee.empID as shiftEmpID,
            invoice.totalProfit as profit,invoice.invID as invID,dateTime,DATE_FORMAT(dateTime,'%H:%i %p') AS time,
            invoice.isSupply as isSupply,invoice.personID as PID,invoice.fuel_liters as fuel_liters,invoice.shiftID as shiftID
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
                    invoice.type as name,invoice.amount as amount,
                    invoice.note as note,invoice.fuel_liters as quantity,invoice.type as type,
                    employee.name as empName,employee.user_type as empType,employee.empID as shiftEmpID,
                    invoice.totalProfit as profit,invoice.invID as invID,dateTime,DATE_FORMAT(dateTime,'%H:%i %p') AS time,
                    invoice.isSupply as isSupply,invoice.personID as PID,invoice.fuel_liters as fuel_liters,invoice.shiftID as shiftID
                    FROM invoice 
                    left JOIN person on person.PID=invoice.personID 
                    left JOIN shift on shift.shiftID=invoice.shiftID 
                    left JOIN employee on employee.empID=shift.empID 
                    WHERE type in ('wash') and invoice.shiftID in ($shiftID) 
                    and invoice.isSupply = 0 and invoice.rest > 0
            ))as table1");
        } else if($type == 'lub' || $type == 'access'){
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
            $this->db->where_in('invoice.shiftID',$shiftIDs);
            $query = $this->db->get();
            return $query->result();
        } else if($type == 'wash' || $type == 'return'){
            $this->db->select(" invoice.invID as invID,invoice.amount as amount,invoice.note as note,
            invoice.rest as rest,person.full_name as clientName,
            employee.name as empName,employee.user_type as empType,employee.empID as shiftEmpID,
            invoice.totalProfit as profit,dateTime,invoice.type as type,DATE_FORMAT(dateTime,'%H:%i %p') AS time,
            invoice.isSupply as isSupply,invoice.personID as PID,invoice.fuel_liters as fuel_liters,invoice.shiftID as shiftID");
            $this->db->from('invoice');
            $this->db->join('person', 'person.PID=invoice.personID','left');
            $this->db->join('shift', 'shift.shiftID=invoice.shiftID','left');
            $this->db->join('employee', 'employee.empID=shift.empID','left');
            $this->db->where('invoice.type',$type);
            $this->db->where('invoice.isSupply = 0');
            $this->db->where_in('invoice.shiftID',$shiftIDs);
            $query = $this->db->get();
            // return $query->result();
        } else if($type == 'payC'){
            
            $this->db->select(" invoice.invID as invID,invoice.amount as amount,invoice.note as note,
            invoice.rest as rest,
            employee.name as empName,employee.user_type as empType,employee.empID as shiftEmpID,
            invoice.totalProfit as profit,dateTime,invoice.type as type,DATE_FORMAT(dateTime,'%H:%i %p') AS time,
            invoice.isSupply as isSupply,invoice.personID as PID,invoice.fuel_liters as fuel_liters,invoice.shiftID as shiftID");
            $this->db->from('invoice');
            $this->db->join('shift', 'shift.shiftID=invoice.shiftID','left');
            $this->db->join('employee', 'employee.empID=shift.empID','left');
            $this->db->where('invoice.type',$type);
            $this->db->where('invoice.isSupply = 0');
            $this->db->where_in('invoice.shiftID',$shiftIDs);
            $query = $this->db->get();
            // return $query->result();
        } else if ($type == 'supply'){
            $shiftID = "'" .implode("','", $shiftIDs  ) . "'";
            $query = $this->db->query("select * from((select invoice.invID as invID, invoice.amount as amount,
            invoice.rest as rest,person.full_name as clientName,`item-service`.name as name,
            inv_order.quantity as quantity,employee.name as empName,employee.user_type as empType,
            employee.empID as shiftEmpID,dateTime,invoice.type as type,DATE_FORMAT(dateTime,'%H:%i %p') AS time,
            invoice.isSupply as isSupply,invoice.personID as PID,invoice.fuel_liters as fuel_liters,invoice.shiftID as shiftID
            from invoice 
            left JOIN inv_order on inv_order.invID=invoice.invID 
            left JOIN `item-service` on inv_order.itemID=`item-service`.itemID
            left JOIN person on person.PID=invoice.personID 
            left JOIN shift on shift.shiftID=invoice.shiftID
            left JOIN employee on employee.empID=shift.empID 
            where invoice.type in ('access','lub') and invoice.isSupply = 1 and invoice.shiftID in ($shiftID) )
            UNION (
                select invoice.invID as invID, invoice.amount as amount,
                invoice.rest as rest,person.full_name as clientName,invoice.type as name,
                invoice.fuel_liters as quantity,employee.name as empName,employee.user_type as empType,
                employee.empID as shiftEmpID,dateTime,invoice.type as type,DATE_FORMAT(dateTime,'%H:%i %p') AS time,
                invoice.isSupply as isSupply,invoice.personID as PID,invoice.fuel_liters as fuel_liters,invoice.shiftID as shiftID
                from invoice 
                left JOIN person on person.PID=invoice.personID 
                left JOIN shift on shift.shiftID=invoice.shiftID
                left JOIN employee on employee.empID=shift.empID 
                where invoice.type in ('fuel') and invoice.isSupply = 1 and invoice.shiftID in ($shiftID))
            )as table1 ");
        } else if ($type =='allType'){
            $shiftID = "'" .implode("','", $shiftIDs  ) . "'";
            $query = $this->db->query("select * from((select DATE_FORMAT(dateTime,'%H:%i %p') AS time,person.full_name as clientName,
            `item-service`.name as name,inv_order.quantity as quantity,
            employee.name as empName,employee.user_type as empType,
            employee.empID as shiftEmpID,IFNULL(invoice.totalProfit,0)  as profit,shift.shiftID as shiftID,invoice.type as type,
            invoice.amount as amount,invoice.rest as rest,invoice.isSupply as isSupply,invoice.note as note,
            invoice.invID as invID,dateTime,invoice.personID as PID,invoice.fuel_liters as fuel_liters,invoice.shiftID as shiftID
            FROM invoice 
            left JOIN inv_order on inv_order.invID=invoice.invID 
            left JOIN `item-service` on inv_order.itemID=`item-service`.itemID
            left JOIN person on person.PID=invoice.personID 
            left JOIN shift on shift.shiftID=invoice.shiftID
            left JOIN employee on employee.empID=shift.empID 
            WHERE type in ('access','lub') and invoice.shiftID  in ($shiftID))
            UNION (
                select DATE_FORMAT(dateTime,'%H:%i %p') AS time,person.full_name as clientName,
                invoice.type as name,invoice.fuel_liters as quantity,
                employee.name as empName,employee.user_type as empType,
                employee.empID as shiftEmpID,IFNULL(invoice.totalProfit,0)  as profit,shift.shiftID as shiftID,invoice.type as type,
                invoice.amount as amount,invoice.rest as rest,invoice.isSupply as isSupply,invoice.note as note,
                invoice.invID as invID,dateTime,invoice.personID as PID,invoice.fuel_liters as fuel_liters,invoice.shiftID as shiftID
                    FROM invoice 
                    left JOIN person on person.PID=invoice.personID 
                    left JOIN shift on shift.shiftID=invoice.shiftID
                    left JOIN employee on employee.empID=shift.empID 
                    WHERE type in ('wash','payC','return','Diesel G','Diesel R','95','98','98_d','95_d','dieselG_d','dieselR_d') 
                    and invoice.shiftID  in ($shiftID)
                    ))as table1 ");
        } else if($type == "counters"){
            $shiftID = "'" .implode("','", $shiftIDs  ) . "'";
            $query = $this->db->query("       
                SELECT `invoice`.`invID` as invID, `invoice`.`amount` as `amount`,
                invoice.type as name,
                `invoice`.`note` as `note`,`invoice`.`fuel_liters` as `quantity`, 
                `invoice`.`rest` as `rest`, `person`.`full_name` as `clientName`, 
                `employee`.`name` as `empName`, `employee`.`user_type` as `empType`, 
                `employee`.`empID` as `shiftEmpID`, `invoice`.`totalProfit` as `profit`, 
                `invoice`.`shiftID` as `shiftID`, `invoice`.`type` as `type`,
                dateTime,DATE_FORMAT(dateTime,'%H:%i %p') AS time,invoice.isSupply as isSupply,
                invoice.personID as PID,invoice.fuel_liters as fuel_liters,invoice.shiftID as shiftID
                FROM `invoice` 
                left JOIN `person` ON `person`.`PID`=`invoice`.`personID` 
                left JOIN `shift` ON `shift`.`shiftID`=`invoice`.`shiftID` 
                left JOIN `employee` ON `employee`.`empID`=`shift`.`empID`  
                WHERE `invoice`.`type` IN('Diesel G','Diesel R','95','98','98_d','95_d','dieselG_d','dieselR_d') 
                AND `invoice`.`isSupply` = 0 AND invoice.shiftID in ($shiftID)

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
            shift.shiftID as shiftID,DATE_FORMAT(dateTime,'%H:%i %p') AS time ,
            invoice.invID as invID,dateTime
             FROM invoice 
             left JOIN inv_order on inv_order.invID=invoice.invID 
             left JOIN `item-service` on inv_order.itemID=`item-service`.itemID 
             left JOIN person on person.PID=invoice.personID 
             left JOIN shift on shift.shiftID=invoice.shiftID 
             left JOIN employee on employee.empID=shift.empID 
             WHERE type in ('access','lub') and invoice.isSupply = 0 and invoice.rest > 0 and invoice.shiftID ='".$shiftID."') 
             UNION 
             ( select invoice.rest as rest,person.full_name as clientName, invoice.type as name,invoice.amount as amount, 
             invoice.note as note,invoice.fuel_liters as quantity,invoice.type as type, employee.name as empName,
             employee.user_type as empType,employee.empID as shiftEmpID, invoice.totalProfit as profit,
             shift.shiftID as shiftID,DATE_FORMAT(dateTime,'%H:%i %p') AS time ,
             invoice.invID as invID,dateTime
              FROM invoice 
              left JOIN person on person.PID=invoice.personID 
              left JOIN shift on shift.shiftID=invoice.shiftID 
              left JOIN employee on employee.empID=shift.empID 
              WHERE type in ('wash','98_d','95_d','dieselG_d','dieselR_d') and invoice.isSupply = 0 and invoice.rest > 0 and invoice.shiftID ='".$shiftID."'))as table1 ");
        } else if($type == 'lub' || $type == 'access'){
            
            $this->db->select(" `item-service`.name as name,invoice.amount as amount,invoice.empID as ids,dateTime as datetime,
            invoice.note as note,inv_order.quantity as quantity,invoice.rest as rest,person.full_name as clientName,
            employee.name as empName,employee.user_type as empType,
            employee.empID as shiftEmpID,invoice.totalProfit as profit,shift.shiftID as shiftID,
            DATE_FORMAT(dateTime,'%H:%i %p') AS time,invoice.invID as invID,dateTime");
            $this->db->from('invoice');
            $this->db->join('inv_order', 'inv_order.invID = invoice.invID','left');
            $this->db->join('`item-service`', 'inv_order.itemID=`item-service`.itemID','inner');
            $this->db->join('person', 'person.PID=invoice.personID','inner');
            $this->db->join('shift', 'shift.shiftID=invoice.shiftID','inner');
            $this->db->join('employee', 'employee.empID=shift.empID','inner');
            $this->db->where('invoice.shiftID',$shiftID);
            $this->db->where('invoice.type',$type);
            $this->db->where('invoice.isSupply = 0');
            
            $query = $this->db->get();
            $sql = $this->db->last_query();
        } else if($type == 'wash' || $type == 'return'){
            $this->db->select(" invoice.amount as amount,invoice.note as note,
            invoice.rest as rest,person.full_name as clientName,
            employee.name as empName,employee.user_type as empType,invoice.totalProfit as profit,
            DATE_FORMAT(dateTime,'%H:%i %p') AS time,invoice.invID as invID,dateTime");
            $this->db->from('invoice');
            $this->db->join('person', 'person.PID=invoice.personID','left');
            $this->db->join('shift', 'shift.shiftID=invoice.shiftID','left');
            $this->db->join('employee', 'employee.empID=shift.empID','left');
            $this->db->where('invoice.shiftID',$shiftID);
            $this->db->where('invoice.type',$type);
            $this->db->where('invoice.isSupply = 0');
            $query = $this->db->get();
        } else if($type == 'payC'){
            $this->db->select(" invoice.amount as amount,invoice.note as note,
            invoice.rest as rest,
            employee.name as empName,employee.user_type as empType,invoice.totalProfit as profit,
            DATE_FORMAT(dateTime,'%H:%i %p') AS time,invoice.invID as invID,dateTime");
            $this->db->from('invoice');
            $this->db->join('shift', 'shift.shiftID=invoice.shiftID','left');
            $this->db->join('employee', 'employee.empID=shift.empID','left');
            $this->db->where('invoice.shiftID',$shiftID);
            $this->db->where('invoice.type',$type);
            $this->db->where('invoice.isSupply = 0');
            $query = $this->db->get();
        } else if ($type == 'supply'){
            
            $query = $this->db->query("select * from((select invoice.amount as amount,
            invoice.rest as rest,person.full_name as clientName,`item-service`.name as name,
            inv_order.quantity as quantity,employee.name as empName,employee.user_type as empType,
            employee.empID as shiftEmpID,DATE_FORMAT(dateTime,'%H:%i %p') AS time,invoice.invID as invID,dateTime
            from invoice 
            left JOIN inv_order on inv_order.invID=invoice.invID 
            left JOIN `item-service` on inv_order.itemID=`item-service`.itemID
            left JOIN person on person.PID=invoice.personID 
            left JOIN shift on shift.shiftID=invoice.shiftID
            left JOIN employee on employee.empID=shift.empID 
            where invoice.type in ('access','lub') and invoice.isSupply = 1 and invoice.shiftID = '".$shiftID."' )
            UNION (
                select invoice.amount as amount,
                invoice.rest as rest,person.full_name as clientName,invoice.type as name,
                invoice.fuel_liters as quantity,employee.name as empName,employee.user_type as empType,
                employee.empID as shiftEmpID,DATE_FORMAT(dateTime,'%H:%i %p') AS time,invoice.invID as invID,dateTime
                from invoice 
                left JOIN person on person.PID=invoice.personID 
                left JOIN shift on shift.shiftID=invoice.shiftID
                left JOIN employee on employee.empID=shift.empID 
                where invoice.type in ('fuel') and invoice.isSupply = 1 and invoice.shiftID = '".$shiftID."')
            )as table1 ");

        } else if ($type =='allType'){
            $query = $this->db->query("select * from((select DATE_FORMAT(dateTime,'%H:%i %p') AS time,person.full_name as clientName,
            `item-service`.name as name,inv_order.quantity as quantity,
            employee.name as empName,employee.user_type as empType,
            employee.empID as shiftEmpID,IFNULL(invoice.totalProfit,0)  as profit,shift.shiftID as shiftID,invoice.type as type,
            invoice.amount as amount,invoice.rest as rest,invoice.isSupply as isSupply,invoice.note as note,
            invoice.invID as invID,dateTime
            FROM invoice 
            left JOIN inv_order on inv_order.invID=invoice.invID 
            left JOIN `item-service` on inv_order.itemID=`item-service`.itemID
            left JOIN person on person.PID=invoice.personID 
            left JOIN shift on shift.shiftID=invoice.shiftID
            left JOIN employee on employee.empID=shift.empID 
            WHERE type in ('access','lub') and invoice.shiftID ='".$shiftID."')
            UNION (
                select DATE_FORMAT(dateTime,'%H:%i %p') AS time,person.full_name as clientName,
                invoice.type as name,invoice.fuel_liters as quantity,
                employee.name as empName,employee.user_type as empType,
                employee.empID as shiftEmpID,IFNULL(invoice.totalProfit,0)  as profit,shift.shiftID as shiftID,invoice.type as type,
                invoice.amount as amount,invoice.rest as rest,invoice.isSupply as isSupply,invoice.note as note,
                invoice.invID as invID,dateTime
                    FROM invoice 
                    left JOIN person on person.PID=invoice.personID 
                    left JOIN shift on shift.shiftID=invoice.shiftID
                    left JOIN employee on employee.empID=shift.empID 
                    WHERE type in ('wash','payC','return','Diesel G','Diesel R','95','98','98_d','95_d','dieselG_d','dieselR_d') 
                    and invoice.shiftID ='".$shiftID."'))as table1
                   ");

        } else if($type == "counters"){
            $query = $this->db->query("       
                SELECT `invoice`.`invID` as invID, `invoice`.`amount` as `amount`,
                invoice.type as name,
                `invoice`.`note` as `note`,`invoice`.`fuel_liters` as `quantity`, 
                `invoice`.`rest` as `rest`, `person`.`full_name` as `clientName`, 
                `employee`.`name` as `empName`, `employee`.`user_type` as `empType`, 
                `employee`.`empID` as `shiftEmpID`, `invoice`.`totalProfit` as `profit`, 
                `invoice`.`shiftID` as `shiftID`, `invoice`.`type` as `type`,DATE_FORMAT(dateTime,'%H:%i %p') AS time,
                dateTime
                FROM `invoice` 
                left JOIN `person` ON `person`.`PID`=`invoice`.`personID` 
                left JOIN `shift` ON `shift`.`shiftID`=`invoice`.`shiftID` 
                left JOIN `employee` ON `employee`.`empID`=`shift`.`empID`  
                WHERE `invoice`.`type` IN('Diesel G','Diesel R','95','98','98_d','95_d','dieselG_d','dieselR_d') 
                AND `invoice`.`isSupply` = 0 AND `invoice`.`shiftID` = '".$shiftID."'

                ");
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
    /* Get Invoice Sell details filter by invoice ID and type */
    public function getOrderDetails($invID){
        $this->db->select('inv_order.itemID,inv_order.cost as newCost,
        inv_order.quantity as quantityOrder,`item-service`.quantity as quantityStock,`item-service`.cost as AVGCost');
        $this->db->from('inv_order');
        $this->db->join('`item-service`', 'item-service.itemID = inv_order.itemID', 'left');
        $this->db->where('invID', $invID);
        $query = $this->db->get();
        if ($query->num_rows() > 0) {
            return $query->result_array();
        } else {
            return 0;
        }
    }
    /* update stock */
    public function updateStock($id, $data)
    {
        $this->db->where('itemID', $id);
        if ($this->db->update('`item-service`', $data)) {
            return true;
        } else {
            return false;
        }
    }
    /* update qunatity stock */
    public function updateQuantityStock($id, $quantity)
    {
        $this->db->where('itemID', $id);
        $this->db->set('quantity', 'quantity + ' . $quantity, false);
        if ($this->db->update('`item-service`')) {
            return true;
        } else {
            return false;
        }
    }
    /* update amount drawer */
    public function updateAmountDrawer($shiftID, $amount)
    {
        $this->db->where('shiftID', $shiftID);
        $this->db->set('amount', 'amount + ' . $amount, false);
        if ($this->db->update('drawer')) {
            return true;
        } else {
            return false;
        }
    }
    /* update person debit */
    public function updatePersonDebit($id, $amount)
    {
        $this->db->where('PID', $id);
        $this->db->set('debitAmount	', 'debitAmount	 + ' . $amount, false);
        if ($this->db->update('person')) {
            return true;
        } else {
            return false;
        }
    }
    /* deleted invoice */
    public function deleteInvoice($invID)
    {
        $this->db->where('invID', $invID);
        if ($this->db->delete('invoice')) {
            return true;
        } else {
            return false;
        }
    }
    /* deleted order invoice */
    public function deleteOrderInvoice($invID)
    {
        $this->db->where('invID', $invID);
        if ($this->db->delete('inv_order')) {
            return true;
        } else {
            return false;
        }
    }
}
