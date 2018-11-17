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
        $shiftID = "'" .implode("','", $shiftIDs  ) . "'";
        if($type == 'debits'){
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
            WHERE type in ('access','lub') and invoice.shiftID in ( $shiftID )
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
                    WHERE type in ('wash') and invoice.shiftID in ( $shiftID )
                    and invoice.isSupply = 0 and invoice.rest > 0
            ))as table1");
            $sql=$this->db->last_query();
            $ss=1;
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
            $this->db->where_in('invoice.shiftID',$shiftID);
            $query = $this->db->get();
            return $query->result();
        } 
        else
        if($type == 'wash' || $type == 'payC' || $type == 'return'){
            
            $this->db->select(" invoice.invID,invoice.amount as amount,invoice.note as note,
            invoice.rest as rest,person.full_name as clientName,
            employee.name as empName,employee.user_type as empType,employee.empID as shiftEmpID,invoice.totalProfit as profit");
            $this->db->from('invoice');
            $this->db->join('person', 'person.PID=invoice.personID','inner');
            $this->db->join('shift', 'shift.shiftID=invoice.shiftID','inner');
            $this->db->join('employee', 'employee.empID=shift.empID','inner');
            $this->db->where('invoice.type',$type);
            $this->db->where('invoice.isSupply = 0');
            $this->db->where_in('invoice.shiftID',$shiftID);
            $query = $this->db->get();
            return $query->result();
        } else if ($type == 'supply'){
            $this->db->select(" invoice.invID, invoice.amount as amount,
            invoice.rest as rest,person.full_name as clientName,`item-service`.name as name,
            inv_order.quantity as quantity,employee.name as empName,employee.user_type as empType,employee.empID as shiftEmpID");
            $this->db->from('invoice');
            $this->db->join('inv_order', 'inv_order.invID = invoice.invID','inner');
            $this->db->join('`item-service`', 'inv_order.itemID=`item-service`.itemID','inner');
            $this->db->join('person', 'person.PID=invoice.personID','inner');
            $this->db->join('shift', 'shift.shiftID=invoice.shiftID','inner');
            $this->db->join('employee', 'employee.empID=shift.empID','inner');
            $this->db->where_in('invoice.type','access,lub');
            $this->db->where('invoice.isSupply = 1');
            $this->db->where_in('invoice.shiftID',$shiftID);
            $query = $this->db->get();
            return $query->result();
        }else if ($type =='allType'){
            $query = $this->db->query(
                "(select invoice.*,DATE_FORMAT(dateTime,'%H:%i %p') AS time,person.full_name as clientName,
                `item-service`.name as name,inv_order.quantity as quantity,
                employee.name as empName,employee.user_type as empType,employee.empID as shiftEmpID,invoice.totalProfit as profit
                FROM invoice 
                INNER JOIN inv_order on inv_order.invID=invoice.invID 
                INNER JOIN `item-service` on inv_order.itemID=`item-service`.itemID
                INNER JOIN person on person.PID=invoice.personID 
                INNER JOIN employee on employee.empID=invoice.empID 
                WHERE type in ('access','lub') and date(invoice.dateTime) = '".$date."') 
                UNION (
                select invoice.*,DATE_FORMAT(dateTime,'%H:%i %p') AS time,person.full_name as clientName,
                null as name,null as quantity,employee.name as empName,employee.user_type as empType,
                employee.empID as shiftEmpID,invoice.totalProfit as profit
                FROM invoice 
                INNER JOIN person on person.PID=invoice.personID 
                INNER JOIN employee on employee.empID=invoice.empID 
                WHERE type in ('wash','payC','return') and date(invoice.dateTime) = '".$date."')
                order by DATE_FORMAT(dateTime,'%H:%i A') DESC"
            );
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
            ((select invoice.rest as rest,person.full_name as clientName, `item-service`.name as name,invoice.amount as amount, invoice.note as note,inv_order.quantity as quantity,invoice.type as type, employee.name as empName,employee.user_type as empType,employee.empID as shiftEmpID, invoice.totalProfit as profit,shift.shiftID as shiftID,DATE_FORMAT(dateTime,'%H:%i %p') AS time 
             FROM invoice 
             left JOIN inv_order on inv_order.invID=invoice.invID 
             left JOIN `item-service` on inv_order.itemID=`item-service`.itemID 
             left JOIN person on person.PID=invoice.personID 
             left JOIN shift on shift.shiftID=invoice.shiftID 
             left JOIN employee on employee.empID=invoice.empID 
             WHERE type in ('access','lub') and invoice.isSupply = 0 and invoice.rest > 0 and invoice.shiftID ='".$shiftID."') 
             UNION 
             ( select invoice.rest as rest,person.full_name as clientName, null as name,invoice.amount as amount, invoice.note as note,null as quantity,invoice.type as type, employee.name as empName,employee.user_type as empType,employee.empID as shiftEmpID, invoice.totalProfit as profit,shift.shiftID as shiftID,DATE_FORMAT(dateTime,'%H:%i %p') AS time 
              FROM invoice 
              left JOIN inv_order on inv_order.invID=invoice.invID 
              left JOIN `item-service` on inv_order.itemID=`item-service`.itemID 
              left JOIN person on person.PID=invoice.personID 
              left JOIN shift on shift.shiftID=invoice.shiftID 
              left JOIN employee on employee.empID=invoice.empID 
              WHERE type = 'wash' and invoice.isSupply = 0 and invoice.rest > 0 and invoice.shiftID ='".$shiftID."'))as table1 ");
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
        else if($type == 'wash' || $type == 'payC' || $type == 'return'){
            $this->db->select(" invoice.amount as amount,invoice.note as note,
            invoice.rest as rest,person.full_name as clientName,
            employee.name as empName,employee.user_type as empType,invoice.totalProfit as profit,,DATE_FORMAT(dateTime,'%H:%i %p') AS time");
            $this->db->from('invoice');
            $this->db->join('person', 'person.PID=invoice.personID','inner');
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
            $this->db->where_in('invoice.type',"access,lub");
            $this->db->where('invoice.isSupply = 1');
            $query = $this->db->get();
        }else if ($type =='allType'){
            $query = $this->db->query("select * from((select DATE_FORMAT(dateTime,'%H:%i %p') AS time,person.full_name as clientName,
            `item-service`.name as name,inv_order.quantity as quantity,
            employee.name as empName,employee.user_type as empType,
            employee.empID as shiftEmpID,invoice.totalProfit as profit,shift.shiftID as shiftID
            FROM invoice 
            left JOIN inv_order on inv_order.invID=invoice.invID 
            left JOIN `item-service` on inv_order.itemID=`item-service`.itemID
            left JOIN person on person.PID=invoice.personID 
            left JOIN shift on shift.shiftID=invoice.shiftID
            left JOIN employee on employee.empID=invoice.empID 
            WHERE type in ('access','lub') and invoice.shiftID ='".$shiftID."')
            UNION (
                select DATE_FORMAT(dateTime,'%H:%i %p') AS time,person.full_name as clientName,
                null as name,null as quantity,
                employee.name as empName,employee.user_type as empType,
                employee.empID as shiftEmpID,invoice.totalProfit as profit,shift.shiftID as shiftID
                    FROM invoice 
                    left JOIN person on person.PID=invoice.personID 
                    left JOIN shift on shift.shiftID=invoice.shiftID
                    left JOIN employee on employee.empID=invoice.empID 
                    WHERE type in ('wash','payC','return') and invoice.shiftID ='".$shiftID."'))as table1
                   ");
            //  order_by invoice.dateTime DESC 
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
