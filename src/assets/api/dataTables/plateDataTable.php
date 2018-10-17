<?php
include './connection.php';
openConn();

$requestData = $_REQUEST;
$rowsReq = (isset($_GET['length'])) ? intval($_GET['length']) : 10;
$start = (isset($_GET['start'])) ? intval($_GET['start']) : 0;
$orderString = "";

$rowsCount = mysqli_fetch_assoc(mysqli_query(openConn(), "SELECT COUNT(PLID) as exp FROM plate"))['exp'];

if (count($_GET['order'])) {
    $orderBy = $_GET['columns'][$_GET['order'][0]['column']]['data'];
    $orderDir = $_GET['order'][0]['dir'];
    $orderString = " ORDER BY " . $orderBy . " " . $orderDir;
}
if (isset($_GET["search"]["value"]) && !empty($_GET["search"]["value"])) {
    $search = $_GET["search"]["value"];

    $plateDTQuery = " SELECT plate.*, job.name as jobName,client.name as clientName FROM plate inner join job on plate.JID = job.JID inner join client on job.CID = client.CID  where plate.name like '%" . $search . "%' OR job.name like '%" . $search . "%' OR client.name like '%" . $search . "%' " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;

} else {

    $plateDTQuery = " SELECT plate.*,client.CID as CID, job.name as jobName,client.name as clientName FROM plate inner join job on plate.JID = job.JID inner join client on job.CID = client.CID " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;

}

$plateDTQuerySQL = mysqli_query(openConn(), $plateDTQuery);
$rowsCountFilter = mysqli_num_rows($plateDTQuerySQL);
$jsonData = "";
if ($plateDTQuerySQL) {
    while ($row = mysqli_fetch_assoc($plateDTQuerySQL)) {
        if ($row != null) {
            if ($jsonData != "") {
                $jsonData = $jsonData . ",";
            }
            $jsonData = $jsonData . '{"ID":"' . $row['PLID'] . '",';
            $jsonData = $jsonData . '"name":"' . $row['name'] . '",';
            $jsonData = $jsonData . '"jobName":"' . $row['jobName'] . '",';
            $jsonData = $jsonData . '"clientName":"' . $row['clientName'] . '",';

            $jsonData = $jsonData . '"width":"' . $row['width'] . '",';
            $jsonData = $jsonData . '"height":"' . $row['height'] . '",';
            $jsonData = $jsonData . '"thickness":"' . $row['thickness'] . '",';
            

            $jsonData = $jsonData . '"dimensions":"' . $row['width'] .' x '.$row['height'].' x '.$row['thickness']. '",';
            
            $jsonData = $jsonData . '"thickness_price":"' . $row['thickness_price'] . '",';            
            $jsonData = $jsonData . '"nbrOfColors":"' . $row['num_of_colors'] . '",';
            $jsonData = $jsonData . '"price":"' . $row['price'] . '",';
            $jsonData = $jsonData . '"jobID":"' . $row['JID'] . '",';
            $jsonData = $jsonData . '"clientID":"' . $row['CID'] . '",';
            $jsonData = $jsonData . '"quantity":"' . $row['num_of_faces'] . '"}';
        }
    }
}
$jsonData = '[' . $jsonData . ']';
$jsonData2 = '{"draw":' . intval($requestData['draw']) . ',"recordsTotal":' . $rowsCount . ', "recordsFiltered":' . $rowsCount . ', "data":' . $jsonData . '}';
echo ($jsonData2);
closeConn();
