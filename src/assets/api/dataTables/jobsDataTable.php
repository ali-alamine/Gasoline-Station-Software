<?php 
include './connection.php';
openConn();
// $userID = $_GET['userID'];
// echo $userID;
$requestData= $_REQUEST;
$rowsReq = (isset($_GET['length'])) ? intval($_GET['length']) : 10;
$start = (isset($_GET['start'])) ? intval($_GET['start']) : 0;
$orderString="";
$rowsCount=mysqli_fetch_assoc(mysqli_query(openConn(),"SELECT count(JID) as 'exp' from job"))['exp'];

if(count($_GET['order']))
{
    $orderBy = $_GET['columns'][$_GET['order'][0]['column']]['data'];
    $orderDir = $_GET['order'][0]['dir'];
    $orderString=" ORDER BY ".$orderBy." ".$orderDir;
}
if(isset($_GET["search"]["value"]) && !empty($_GET["search"]["value"]))
{
    $search = $_GET["search"]["value"];
    $getAllFactureQuery="SELECT job.*,client.name as clientName FROM job inner join client on job.CID = client.CID where name like '%".$search."%' OR date_creation like '%".$search."%' OR client.name like '%" . $search . "%'  ".$orderString." LIMIT ".$rowsReq." OFFSET ".$start;
}
else
{
    $getAllFactureQuery= " SELECT job.*,client.name as clientName FROM job inner join client on job.CID = client.CID ".$orderString." LIMIT ".$rowsReq." OFFSET ".$start;
}

$getAllFactureQuerySQL = mysqli_query(openConn(),$getAllFactureQuery); 
$rowsCountFilter = mysqli_num_rows($getAllFactureQuerySQL);
$jsonData="";
if($getAllFactureQuerySQL){
    while ($row=mysqli_fetch_assoc($getAllFactureQuerySQL)){
        if($row != NULL){
            if($jsonData != ""){
                $jsonData = $jsonData . ",";
            }
            $jsonData = $jsonData . '{"JID":"' . $row['JID'] . '",';
            $jsonData = $jsonData . '"CID":"' . $row['CID'] . '",';
            $jsonData = $jsonData . '"name":"' . $row['name'] . '",';
            $jsonData = $jsonData . '"clientName":"' . $row['clientName'] . '",';
            $jsonData = $jsonData . '"date_d":"' . $row['date_creation'] . '",';
            $jsonData = $jsonData . '"total":"' . $row['total'] . '",';
            $jsonData = $jsonData . '"image":"' . $row['image'] . '",';
            $jsonData = $jsonData . '"comment":"' . $row['comments'] . '"}';
        }
    }
}
// echo "haifaa";
$jsonData = '[' . $jsonData . ']';
$jsonData2='{"draw":'.intval($requestData['draw']).',"recordsTotal":'.$rowsCount.', "recordsFiltered":'.$rowsCount.', "data":'.$jsonData.'}';
echo ($jsonData2);
closeConn();

?>