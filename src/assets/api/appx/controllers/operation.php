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
        "type" => $type,'dateTime'=>$today_date,'rest'=>$rest,"empID"=>$empID,
        "personID"=>$personID,"note"=>$comment,'isSupply'=>$isSupply));

        /* Get last inserted invoice ID */
        $invID = $this->db->insert_id(); 

        /* insert into inv_order */
        $this->operation_model->add_inv_order(array("invID"=>$invID,
        "itemID" => $itemID,'quantity'=>$quantity,'cost'=>$cost,'price'=>$price));

        /* update stock */
        if($invoiceType == "supply"){
           $this->operation_model->update_stock($itemID,$quantity);
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
         $personID=$this->post('clientID');
         $amount = 0;
         $rest=$this->post('amountRest');
         $type = 'wash';
         $comment=$this->post('comment');
        /* insert into invoice  */
        $result = $this->operation_model->add_inv(array("amount"=>$amount,
        "type" => $type,'dateTime'=>$today_date,'rest'=>$rest,"empID"=>$empID,"personID"=>$personID,"note"=>$comment));
        $str=$this->db->last_query();
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
         $personID=0; /* no registered client */
         $amount =$this->post('price');
         $rest=0;
         $type = 'wash';
         $comment=$this->post('machineName');

         
        /* insert into invoice  */
        $result = $this->operation_model->add_inv(array("amount"=>$amount,
        "type" => $type,'dateTime'=>$today_date,'rest'=>$rest,"empID"=>$empID,"personID"=>$personID,"note"=>$comment));
        $str=$this->db->last_query();
        if ($result === 0) {
            $this->response("Item information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }
    }

    // /* supply -    */
    // public function supply_post(){
    //     /*START - Get Current Date Time */
    //     $currentFullDate=getdate();
    //     $d=$currentFullDate['mday'];
    //     $m=$currentFullDate['mon'];
    //     $y=$currentFullDate['year'];
    //     $time=date("h:i");
    //     $today_date=$y."-".$m."-".$d."-".$time;
    //     /*END - Get Current Date Time */

    //     // $rest = $this->post('amountRest');
    //     // if($rest==null){
    //     //     $rest = 0; /* refer to sell on cash */
    //     // }
    //     // $itemID=$this->post('itemID');
        
    //     // $comment=$this->post('comment');
    //     // if($comment==null){
    //         $comment="supply";
    //     // }
    //     $empID=$this->post('empID');
    //     $clientID=$this->post('clientID');
    //     if($clientID != null){
    //         $personID=$clientID ;  /* refer to client debit sell */
    //     }else{
    //         $personID=0; /* refer to client cash sell*/
    //     }
    
    //     $itemName = $this->post('name');
    //     $amount = $this->post('totalPrice');
    //     $type = $this->post('type');
    //     $price=$this->post('price');
    //     $quantity=$this->post('quantity');
    //     $rest=$this->post('rest');
    //     $cost=0;

    //     /* insert into invoice  */
    //     $result = $this->operation_model->add_inv(array("amount"=>$amount,
    //     "type" => $type,'dateTime'=>$today_date,'rest'=>$rest,"empID"=>$empID,"personID"=>$personID,"note"=>$comment));

    //     /* Get last inserted invoice ID */
    //     $invID = $this->db->insert_id(); 

    //     /* insert into inv_order */
    //     $result = $this->operation_model->add_inv_order(array("invID"=>$invID,
    //     "itemID" => $itemID,'quantity'=>$quantity,'cost'=>$cost,'price'=>$price));

    //     /* update stock */
    //     $result = $this->operation_model->update_stock($itemID,$quantity);

    //     if ($result === 0) {
    //         $this->response("Item information could not be saved. Try again.", 404);
    //     } else {
    //         $this->response("success", 200);
    //     }
        
    // }
    
}
