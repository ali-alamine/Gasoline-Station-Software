<?php
include './connection.php';
openConn();

$requestData = $_REQUEST;
$rowsReq = (isset($_GET['length'])) ? intval($_GET['length']) : 10;
$start = (isset($_GET['start'])) ? intval($_GET['start']) : 0;
$orderString = "";

$rowsCount = mysqli_fetch_assoc(mysqli_query(openConn(), "SELECT COUNT(SBID) as exp FROM subscriber"))['exp'];

if (count($_GET['order'])) {
    $orderBy = $_GET['columns'][$_GET['order'][0]['column']]['data'];
    if ($orderBy == 'ID') {
        $orderBy = 'SBID';
    } else if ($orderBy == 'expDate') {
        $orderBy = 'Sub2.exp_date';
    }
    else if ($orderBy == 'subDate') {
        $orderBy = 'Sub2.sub_date';
    }
    else if ($orderBy == 'isPaid') {
        $orderBy = 'Sub2.is_paid';
    }

    $orderDir = $_GET['order'][0]['dir'];
    $orderString = " ORDER BY " . $orderBy . " " . $orderDir;
}
if (isset($_GET["search"]["value"]) && !empty($_GET["search"]["value"])) {
    $search = $_GET["search"]["value"];

    $getAllFactureQuery = "SELECT subscriber.SBID,subscriber.name,subscriber.phone,subscriber.address,subscriber.profile,subscriber.is_activated,Sub2.exp_date,Sub2.sub_date,COALESCE(Sub2.is_paid, 'N/A') as is_paid,SBDID FROM subscriber left JOIN ( SELECT subscriber_detail.* FROM (SELECT SBID, MAX(exp_date) AS maxDate FROM subscriber_detail GROUP BY SBID ) as Sub1 INNER JOIN subscriber_detail ON subscriber_detail.SBID = Sub1.SBID AND subscriber_detail.exp_date = Sub1.maxDate) AS Sub2 ON subscriber.SBID = Sub2.SBID  where name like '%" . $search . "%' OR phone like '%" . $search . "%' OR address like '%" . $search . "%' OR subscriber.profile like '%" . $search . "%' OR Sub2.exp_date like '%" . $search . "%' " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;

} else {

    $getAllFactureQuery = " SELECT subscriber.SBID,subscriber.name,subscriber.phone,subscriber.address,subscriber.profile,subscriber.is_activated,Sub2.exp_date,Sub2.sub_date,COALESCE(Sub2.is_paid, 'N/A')as is_paid,SBDID   FROM subscriber left JOIN ( SELECT subscriber_detail.* FROM (SELECT SBID, MAX(exp_date) AS maxDate FROM subscriber_detail GROUP BY SBID ) as Sub1 INNER JOIN subscriber_detail ON subscriber_detail.SBID = Sub1.SBID AND subscriber_detail.exp_date = Sub1.maxDate) AS Sub2 ON subscriber.SBID = Sub2.SBID " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;

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
$jsonData2 = '{"draw":' . intval($requestData['draw']) . ',"recordsTotal":' . $rowsCount . ', "recordsFiltered":' . $rowsCount . ', "data":' . $jsonData . '}';
echo ($jsonData2);
closeConn();
