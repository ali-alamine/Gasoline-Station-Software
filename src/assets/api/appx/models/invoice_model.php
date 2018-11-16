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
    /* Get All Invoice filter by type and date and empID */
    public function getDetailInvoice($type,$shiftID,$date){

        if($type == 'debits'){
            $query = $this->db->query("(select invoice.rest as rest,person.full_name as clientName,
            `item-service`.name as name,invoice.amount as amount,
            invoice.note as note,inv_order.quantity as quantity,invoice.type as type,
            employee.name as empName,employee.user_type as empType,employee.empID as shiftEmpID,invoice.totalProfit as profit
            FROM invoice 
            INNER JOIN inv_order on inv_order.invID=invoice.invID 
            INNER JOIN `item-service` on inv_order.itemID=`item-service`.itemID
            INNER JOIN person on person.PID=invoice.personID 
            INNER JOIN employee on employee.empID=invoice.empID 
            WHERE type in ('access','lub') and date(invoice.dateTime) = '".$date."' 
            and invoice.isSupply = 0 and invoice.rest > 0 ) 
            UNION (
                select invoice.rest as rest,person.full_name as clientName,
                    null as name,invoice.amount as amount,
                    invoice.note as note,null as quantity,invoice.type as type,
                    employee.name as empName,employee.user_type as empType,employee.empID as shiftEmpID,invoice.totalProfit as profit
                    FROM invoice 
                    INNER JOIN person on person.PID=invoice.personID 
                    INNER JOIN employee on employee.empID=invoice.empID 
                    WHERE type in ('wash') and date(invoice.dateTime) = '".$date."' 
                    and invoice.isSupply = 0 and invoice.rest > 0
            ) ");
        } 
        elseif($type == 'lub' || $type == 'access'){
            $query = $this->db->query("select `item-service`.name as name,invoice.amount as amount,
                invoice.note as note,inv_order.quantity as quantity,invoice.rest as rest,person.full_name as clientName,
                employee.name as empName,employee.user_type as empType,employee.empID as shiftEmpID,invoice.totalProfit as profit
                FROM invoice 
                INNER JOIN person on person.PID=invoice.personID 
                INNER JOIN inv_order on inv_order.invID=invoice.invID 
                INNER JOIN `item-service` on inv_order.itemID=`item-service`.itemID
                INNER JOIN employee on employee.empID=invoice.empID 
                WHERE type = '".$type."' 
                and date(invoice.dateTime) = '".$date."' 
                and invoice.isSupply = 0");
            // $this->db->from("invoice");
            // $this->db->join('inv_order', 'inv_order.invID=invoice.invID', 'inner');
            // $this->db->join('item-service', 'inv_order.itemID=item-service.itemID', 'inner');
            // $this->db->where_in('invoice.empID',$empID);
            // $this->db->where("invoice.type = '".$type."' 
            //                 and date(invoice.dateTime) = '".$date."' and invoice.invoice.empID =  '".$empID.")
            //                 and invoice.isSupply = 0 and invoice.rest = 0 ");
            // $this->db->order_by("itemID", "DESC");
            // $query = $this->db->get();
            // return $query->result();
        } 
        else
        if($type == 'wash' || $type == 'payC' || $type == 'return'){
            $query = $this->db->query("Select invoice.amount as amount,invoice.note as note,
            invoice.rest as rest,person.full_name as clientName,
            employee.name as empName,employee.user_type as empType,employee.empID as shiftEmpID,invoice.totalProfit as profit
            from invoice 
            inner join person on personID=PID 
            INNER JOIN employee on employee.empID=invoice.empID 
            where type = '".$type."'  and date(dateTime) = '".$date."'  and isSupply = 0 ");
        } else if ($type == 'supply'){
            $query = $this->db->query("Select invoice.amount as amount,
            invoice.rest as rest,person.full_name as clientName,`item-service`.name as name,
            inv_order.quantity as quantity,employee.name as empName,employee.user_type as empType,employee.empID as shiftEmpID
            from invoice
            INNER JOIN inv_order on inv_order.invID=invoice.invID 
            INNER JOIN `item-service` on inv_order.itemID=`item-service`.itemID
            inner join person on invoice.personID=person.PID 
            INNER JOIN employee on employee.empID=invoice.empID 
            where type in ('access','lub')  and date(dateTime) = '".$date."'  and isSupply = 1 ");

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
           // Query #1
            // $this->db->select("invoice.rest as rest,person.full_name as clientName,
            // `item-service`.name as name,invoice.amount as amount,
            // invoice.note as note,inv_order.quantity as quantity,invoice.type as type,
            // employee.name as empName,employee.user_type as empType,employee.empID as shiftEmpID,
            // invoice.totalProfit as profit,shift.shiftID as shiftID,DATE_FORMAT(dateTime,'%H:%i %p') AS time");
            // $this->db->from('invoice');
            // $this->db->join('inv_order', 'inv_order.invID = invoice.invID','inner');
            // $this->db->join('`item-service`', 'inv_order.itemID=`item-service`.itemID','inner');
            // $this->db->join('person', 'person.PID=invoice.personID','inner');
            // $this->db->join('shift', 'shift.shiftID=invoice.shiftID','inner');
            // $this->db->join('employee', 'employee.empID=invoice.empID','inner');
            // $this->db->where('invoice.empID',$shiftID);
            // $this->db->where_in('type',"access,lub");
            // $this->db->where('rest > 0');
            // $this->db->where('invoice.isSupply = 0');
            // $query1 = $this->db->get()->result();
            // Query #2
            // $this->db->select("invoice.rest as rest,person.full_name as clientName,
            // '' as name,invoice.amount as amount,
            // invoice.note as note,'' as quantity,invoice.type as type,
            // employee.name as empName,employee.user_type as empType,employee.empID as shiftEmpID,
            // invoice.totalProfit as profit,shift.shiftID as shiftID,DATE_FORMAT(dateTime,'%H:%i %p') AS time");
            // $this->db->from('invoice');
            // $this->db->join('inv_order', 'inv_order.invID = invoice.invID','inner');
            // $this->db->join('`item-service`', 'inv_order.itemID=`item-service`.itemID','inner');
            // $this->db->join('person', 'person.PID=invoice.personID','inner');
            // $this->db->join('shift', 'shift.shiftID=invoice.shiftID','inner');
            // $this->db->join('employee', 'employee.empID=invoice.empID','inner');
            // $this->db->where('invoice.empID',$shiftID);
            // $this->db->where('type',"wash");
            // $this->db->where('rest > 0');
            // $this->db->where('invoice.isSupply = 0');
            // $query2 = $this->db->get()->result();
            // $query = array_merge($query1, $query2);
            // $query = $this->db->get();
            
            
            
            // $query = $this->db->query("(select invoice.rest as rest,person.full_name as clientName,
            // `item-service`.name as name,invoice.amount as amount,
            // invoice.note as note,inv_order.quantity as quantity,invoice.type as type,
            // employee.name as empName,employee.user_type as empType,employee.empID as shiftEmpID,
            // invoice.totalProfit as profit,shift.shiftID as shiftID,DATE_FORMAT(dateTime,'%H:%i %p') AS time
            // FROM invoice 
            // INNER JOIN inv_order on inv_order.invID=invoice.invID 
            // INNER JOIN `item-service` on inv_order.itemID=`item-service`.itemID
            // INNER JOIN person on person.PID=invoice.personID 
            // INNER JOIN shift on shift.shitID=invoice.shiftID
            // INNER JOIN employee on employee.empID=invoice.empID 
            // WHERE type in ('access','lub') and date(invoice.dateTime)  
            // and invoice.isSupply = 0 and invoice.rest > 0  and invoice.empID ='".$shiftID.'")
            // UNION (
            //     select invoice.rest as rest,person.full_name as clientName,
            //     null as name,invoice.amount as amount,
            //     invoice.note as note,null as quantity,invoice.type as type,
            //     employee.name as empName,employee.user_type as empType,employee.empID as shiftEmpID,
            //     invoice.totalProfit as profit,shift.shiftID as shiftID,DATE_FORMAT(dateTime,'%H:%i %p') AS time
            //         FROM invoice 
            //         INNER JOIN inv_order on inv_order.invID=invoice.invID 
            //         INNER JOIN `item-service` on inv_order.itemID=`item-service`.itemID
            //         INNER JOIN person on person.PID=invoice.personID 
            //         INNER JOIN shift on shift.shitID=invoice.shiftID
            //         INNER JOIN employee on employee.empID=invoice.empID 
            //         WHERE type = wash and date(invoice.dateTime)
            //         and invoice.isSupply = 0 and invoice.rest > 0 and invoice.empID ='".$shiftID."')
            // ) ");
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
            employee.name as empName,employee.user_type as empType,
            employee.empID as shiftEmpID,invoice.totalProfit as profit,,DATE_FORMAT(dateTime,'%H:%i %p') AS time");
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
            employee.name as empName,employee.user_type as empType,employee.empID as shiftEmpID,DATE_FORMAT(dateTime,'%H:%i %p') AS time'");
            $this->db->from('invoice');
            $this->db->join('inv_order', 'inv_order.invID = invoice.invID','inner');
            $this->db->join('`item-service`', 'inv_order.itemID=`item-service`.itemID','inner');
            $this->db->join('person', 'person.PID=invoice.personID','inner');
            $this->db->join('shift', 'shift.shiftID=invoice.shiftID','inner');
            $this->db->join('employee', 'employee.empID=shift.empID','inner');
            $this->db->where('invoice.shiftID',$shiftID);
            $this->db->where_in('invoice.type',"access','lub'");
            $this->db->where('invoice.isSupply = 1');
            $query = $this->db->get();
        }else if ($type =='allType'){

            // Query #1
            $this->db->select("invoice.*,DATE_FORMAT(dateTime,'%H:%i %p') AS time,person.full_name as clientName,
            `item-service`.name as name,inv_order.quantity as quantity,
            employee.name as empName,employee.user_type as empType,
            employee.empID as shiftEmpID,invoice.totalProfit as profit,shift.shiftID as shiftID,DATE_FORMAT(dateTime,'%H:%i %p') AS time'");
            $this->db->from('invoice');
            $this->db->join('inv_order', 'inv_order.invID = invoice.invID','inner');
            $this->db->join('`item-service`', 'inv_order.itemID=`item-service`.itemID','inner');
            $this->db->join('person', 'person.PID=invoice.personID','inner');
            $this->db->join('shift', 'shift.shiftID=invoice.shiftID','inner');
            $this->db->join('employee', 'employee.empID=invoice.empID','inner');
            $this->db->where('invoice.empID',$shiftID);
            $this->db->where_in('type','access,lub');
            $this->db->order_by("DATE_FORMAT(dateTime,'%H:%i A')", "DESC");
            // $this->db->where('rest > 0');
            // $this->db->where('invoice.isSupply = 0');
            $query1 = $this->db->get()->result();
            // Query #2
            $this->db->select("invoice.*,DATE_FORMAT(dateTime,'%H:%i %p') AS time,person.full_name as clientName,
            `item-service`.name as name,inv_order.quantity as quantity,
            employee.name as empName,employee.user_type as empType,
            employee.empID as shiftEmpID,invoice.totalProfit as profit,shift.shiftID as shiftID,DATE_FORMAT(dateTime,'%H:%i %p') AS time'");
            $this->db->from('invoice');
            $this->db->join('inv_order', 'inv_order.invID = invoice.invID','inner');
            $this->db->join('`item-service`', 'inv_order.itemID=`item-service`.itemID','inner');
            $this->db->join('person', 'person.PID=invoice.personID','inner');
            $this->db->join('shift', 'shift.shiftID=invoice.shiftID','inner');
            $this->db->join('employee', 'employee.empID=invoice.empID','inner');
            $this->db->where('invoice.empID',$shiftID);
            $this->db->where_in('type','wash,payC,return');
            $this->db->order_by("DATE_FORMAT(dateTime,'%H:%i A')", "DESC");

            // $this->db->where('rest > 0');
            // $this->db->where('invoice.isSupply = 0');
            $query2 = $this->db->get()->result();
            // Merge both query results
            $query = array_merge($query1, $query2);
            $query = $this->db->get();


            // $query = $this->db->query(
            //     "(select invoice.*,DATE_FORMAT(dateTime,'%H:%i %p') AS time,person.full_name as clientName,
            //     `item-service`.name as name,inv_order.quantity as quantity,
            //     employee.name as empName,employee.user_type as empType,employee.empID as shiftEmpID,invoice.totalProfit as profit
            //     FROM invoice 
            //     INNER JOIN inv_order on inv_order.invID=invoice.invID 
            //     INNER JOIN `item-service` on inv_order.itemID=`item-service`.itemID
            //     INNER JOIN person on person.PID=invoice.personID 
            //     INNER JOIN employee on employee.empID=invoice.empID 
            //     WHERE type in ('access','lub') and date(invoice.dateTime) BETWEEN '".$fromExpDate."' and '".$toExpDate."') 
            //     UNION (
            //     select invoice.*,DATE_FORMAT(dateTime,'%H:%i %p') AS time,person.full_name as clientName,
            //     null as name,null as quantity,employee.name as empName,employee.user_type as empType,
            //     employee.empID as shiftEmpID,invoice.totalProfit as profit
            //     FROM invoice 
            //     INNER JOIN person on person.PID=invoice.personID 
            //     INNER JOIN employee on employee.empID=invoice.empID 
            //     WHERE type in ('wash','payC','return') and date(invoice.dateTime) BETWEEN '".$fromExpDate."' and '".$toExpDate."')
            //     order by DATE_FORMAT(dateTime,'%H:%i A') DESC"
            // );
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
