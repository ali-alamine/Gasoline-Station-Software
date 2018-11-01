<?php
require APPPATH . '/libraries/REST_Controller.php';
class operation extends REST_Controller{
    public function __construct(){
        parent::__construct();
        $this->load->model('operation_model');
    }
    /* Sell -  sell on debit  */
    public function addInvoice_post(){
        
        /*START - Get Current Date Time */
        $currentFullDate=getdate();
        $d=$currentFullDate['mday'];
        $m=$currentFullDate['mon'];
        $y=$currentFullDate['year'];
        $time=date("h:i");
        $today_date=$y."-".$m."-".$d."-".$time;
        /*END - Get Current Date Time */

        $rest = $this->post('amountRest');
        if($rest == null){
            $rest = 0; /* refer to sell on cash */
        } 
        $itemID=$this->post('itemID');
        $comment=$this->post('comment');
        $empID = $this->post('empID');
        $personID = $this->post('personID');
        if($personID == null){
            $personID = 1 ;  /* refer to client debit sell */
        }
       
        $itemName = $this->post('name');
        $amount = $this->post('totalPrice');
        $type = $this->post('type');
        $price = $this->post('price');
        $totalProfit = $this->post('totalProfit');
        $quantity = $this->post('quantity');
        $invoiceType = $this->post('invoiceType');
        
        /* check Type invoice */
        if($invoiceType == "supply"){
            $isSupply = 1;
            $cost=$price;
            $price = 0 ;
        }
        else{
            $isSupply = 0;
            $cost=0;
        }
        /* start execut querys */ 
        $this->db->trans_begin();

        /* add debit persone */
        if($rest > 0){
            $this->operation_model->add_debit_person($personID,$rest);
        }
        /* insert into invoice  */
        $this->operation_model->add_inv(array("amount"=>$amount,
        "type" => $type,'dateTime'=>$today_date,'rest'=>$rest,'totalProfit'=>$totalProfit,"empID"=>$empID,
        "personID"=>$personID,"note"=>$comment,'isSupply'=>$isSupply));

        /* Get last inserted invoice ID */
        $invID = $this->db->insert_id(); 

        /* insert into inv_order */
        $this->operation_model->add_inv_order(array("invID"=>$invID,
        "itemID" => $itemID,'quantity'=>$quantity,'cost'=>$cost,'price'=>$price));

        /* update stock */
        if($invoiceType == "supply"){
           $this->operation_model->update_stock($itemID,$quantity);
           $this->operation_model->updateCost_stock($itemID,$cost);
        }else{
           $this->operation_model->update_stock($itemID,-$quantity);
        }

        /* End execut querys */ 
        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            $this->response("Invoice information could not be saved. Try again.", 404);
        } else {
            $this->db->trans_commit();
            $this->response("success", 200);
        }
        // if ($result === 0) {
        //     $this->response("Item information could not be saved. Try again.", 404);
        // } else {
        //     $this->response("success", 200);
        // }
        
    }
    /* sell wash service on debit */
    public function sellWashServiceOnDebit_post(){
         /*START - Get Current Date Time */
         $currentFullDate=getdate();
         $d=$currentFullDate['mday'];
         $m=$currentFullDate['mon'];
         $y=$currentFullDate['year'];
         $time=date("h:i");
         $today_date=$y."-".$m."-".$d."-".$time;
         /*END - Get Current Date Time */

         $empID=$this->post('empID');
         $personID=$this->post('personID');
         $amount = $this->post('totalPrice');
         $rest=$this->post('amountRest');
         $totalProfit = $this->post('amountPaid');
        $type = $this->post('type');
        //  $type = 'wash';
        $name='Washing: '.$this->post('name');
        $comment=$this->post('comment');
        if($comment != '')
        $name = $name. ' Note: '.$comment;
        /* insert into invoice  */
        $result = $this->operation_model->add_inv(array("amount"=>$amount,
        "type" => $type,'dateTime'=>$today_date,'rest'=>$rest,"totalProfit"=>$totalProfit,
        "empID"=>$empID,"personID"=>$personID,"note"=>$name));
        $str=$this->db->last_query();

        /* add debit persone */
        if($rest > 0){
            $this->operation_model->add_debit_person($personID,$rest);
        }
        
        if ($result === 0) {
            $this->response("Item information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }
    }
    /* sell wash service on (cash) */
    public function sellWashService_post(){
         /*START - Get Current Date Time */
         $currentFullDate=getdate();
         $d=$currentFullDate['mday'];
         $m=$currentFullDate['mon'];
         $y=$currentFullDate['year'];
         $time=date("h:i");
         $today_date=$y."-".$m."-".$d."-".$time;
         /*END - Get Current Date Time */


         $empID=$this->post('empID');
         $personID=1; /* no registered client */
         $amount =$this->post('price');
         $totalProfit =$this->post('totalProfit');
         $rest=0;
        $type = $this->post('type');
         $name=$this->post('name');

         
        /* insert into invoice  */
        $result = $this->operation_model->add_inv(array("amount"=>$amount,
        "type" => $type,'dateTime'=>$today_date,'rest'=>$rest,
        "totalProfit"=>$totalProfit,"empID"=>$empID,"personID"=>$personID,"note"=>'Washing: '.$name));
        $str=$this->db->last_query();
        if ($result === 0) {
            $this->response("Item information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }
    }
    /* payment Cost  */
    public function addPaymentCostInvoice_post(){
            
        /*START - Get Current Date Time */
        $currentFullDate=getdate();
        $d=$currentFullDate['mday'];
        $m=$currentFullDate['mon'];
        $y=$currentFullDate['year'];
        $time=date("h:i");
        $today_date=$y."-".$m."-".$d."-".$time;
        /*END - Get Current Date Time */
        
        $userID=$this->post('userID');
        $comment=$this->post('comment');
        $amount = $this->post('amount');
    
        /* start execut querys */ 
        $this->db->trans_begin();

        
        /* insert into invoice  */
        $this->operation_model->add_inv(array("amount"=>$amount,
        "type" => 'payC','dateTime'=>$today_date,'rest'=>0,"empID"=>$userID,
        "personID"=>$userID,"note"=>$comment,'isSupply'=>0));

        /* End execut querys */ 
        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            $this->response("Invoice information could not be saved. Try again.", 404);
        } else {
            $this->db->trans_commit();
            $this->response("success", 200);
        }
        
    }
    /* Return Debits  */
    public function addReturnInvoice_post(){
        /*START - Get Current Date Time */
        $currentFullDate=getdate();
        $d=$currentFullDate['mday'];
        $m=$currentFullDate['mon'];
        $y=$currentFullDate['year'];
        $time=date("h:i");
        $today_date=$y."-".$m."-".$d."-".$time;
        /*END - Get Current Date Time */
        
        $empID=$this->post('empID');
        $personID=$this->post('personID');
        $comment=$this->post('comment');
        $paidDebit = $this->post('paidDebit');
    
        /* start execut querys */ 
        $this->db->trans_begin();

        
        /* insert into invoice  */
        $this->operation_model->add_inv(array("amount"=>$paidDebit,
        "type" => 'return','dateTime'=>$today_date,'rest'=>0,"empID"=>$empID,
        "personID"=>$personID,"note"=>$comment,'isSupply'=>0));
        $this->operation_model->add_debit_person($personID,-$paidDebit);

        /* End execut querys */ 
        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            $this->response("Invoice information could not be saved. Try again.", 404);
        } else {
            $this->db->trans_commit();
            $this->response("success", 200);
        }
            
    }
    
}

