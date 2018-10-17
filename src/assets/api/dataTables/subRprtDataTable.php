<?php
include './connection.php';
openConn();

$requestData = $_REQUEST;
$rowsReq = (isset($_GET['length'])) ? intval($_GET['length']) : 10;
$start = (isset($_GET['start'])) ? intval($_GET['start']) : 0;
$orderString = "";

$condition = "WHERE 1 ";
$paid = "is_paid = ";

if (isset($_GET['paid'])) {
    $paidFlag = $_GET['paid'];

    if ($paidFlag == 0) {
        $condition = $condition . "AND is_paid=0";
    } else if ($paidFlag == 1) {
        $condition = $condition . "AND is_paid=1";
    }
}

if (isset($_GET['profile'])) {
    $profile = $_GET['profile'];
    $condition = $condition . " AND subscriber_detail.profile=". $profile;

}

// if (isset($_GET['address'])) {
//     $address = $_GET['address'];
//     $condition = $condition . " AND address = '%". $address."%'";

// }

$rowsCount = mysqli_fetch_assoc(mysqli_query(openConn(), "SELECT COUNT(SBDID) as exp FROM subscriber_detail"))['exp'];

if (count($_GET['order'])) {
    $orderBy = $_GET['columns'][$_GET['order'][0]['column']]['data'];
    if ($orderBy == 'ID') {
        $orderBy = 'subscriber_detail.SBID';
    } else if ($orderBy == 'expDate') {
        $orderBy = 'exp_date';
    } else if ($orderBy == 'subDate') {
        $orderBy = 'sub_date';
    } else if ($orderBy == 'isPaid') {
        $orderBy = 'is_paid';
    } else if ($orderBy == 'profile') {
        $orderBy = 'subscriber_detail.profile';
    }

    $orderDir = $_GET['order'][0]['dir'];
    $orderString = " ORDER BY " . $orderBy . " " . $orderDir;
}
if (isset($_GET["search"]["value"]) && !empty($_GET["search"]["value"])) {
    $search = $_GET["search"]["value"];

    $getAllFactureQuery = "select * from subscriber_detail inner join subscriber on subscriber_detail.SBID = subscriber.SBID  where name like '%" . $search . "%' OR phone like '%" . $search . "%' OR address like '%" . $search . "%' OR subscriber_detail.profile like '%" . $search . "%' OR exp_date like '%" . $search . "%' " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;

} else {

    $getAllFactureQuery = " select *, subscriber.name,subscriber.phone,subscriber.address,subscriber_detail.profile from subscriber_detail inner join subscriber on subscriber_detail.SBID = subscriber.SBID " . $condition . " " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;

}

$getAllFactureQuerySQL = mysqli_query(openConn(), $getAllFactureQuery);
$rowsCountFilter = mysqli_num_rows($getAllFactureQuerySQL);
$jsonData = "";
if ($getAllFactureQuerySQL) {
    while ($row = mysqli_fetch_assoc($getAllFactureQuerySQL)) {
        if ($row != null) {
            if ($jsonData != "") {
                $jsonData = $jsonData . ",";
            }
            $jsonData = $jsonData . '{"ID":"' . $row['SBID'] . '",';
            $jsonData = $jsonData . '"name":"' . $row['name'] . '",';
            $jsonData = $jsonData . '"phone":"' . $row['phone'] . '",';
            $jsonData = $jsonData . '"address":"' . $row['address'] . '",';
            $jsonData = $jsonData . '"subDate":"' . $row['sub_date'] . '",';
            $jsonData = $jsonData . '"expDate":"' . $row['exp_date'] . '",';
            $jsonData = $jsonData . '"profile":"' . $row['profile'] . '",';
            $jsonData = $jsonData . '"isPaid":"' . $row['is_paid'] . '",';
            $jsonData = $jsonData . '"subDetID":"' . $row['SBDID'] . '",';
            $jsonData = $jsonData . '"is_activated":"' . $row['is_activated'] . '"}';
        }
    }
}
$jsonData = '[' . $jsonData . ']';
$jsonData2 = '{"draw":' . intval($requestData['draw']) . ',"recordsTotal":' . $rowsCountFilter . ', "recordsFiltered":' . $rowsCountFilter . ', "data":' . $jsonData . '}';
echo ($jsonData2);
closeConn();
