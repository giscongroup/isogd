<?php
/**
 * User: Julia Suhinina
 * Date: 08.10.13
 * Time: 15:23
 * Description:
 */
session_start();

if (isset($_SESSION['session_id'])) {

//    $db = new PDO('sqlite:db/isogd.db');
    include 'isogd.db.param.php';
    $db = new PDO($dbString, $dbUser, $dbPass);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->exec("set names latin1");
    $post_data = json_decode(file_get_contents('php://input'), true);

    foreach ($post_data['mailto'] as $id) {
        $sql = "INSERT INTO messages (mailfrom, mailto, message, createdate) values (" . $_SESSION['session_id'] . ", " . $id . ", '" . $post_data['textMSG'] . "', '" . date("c") . "');";
        echo $sql;
        $db->exec($sql);
    }
    echo 'complete!';
}
?>
