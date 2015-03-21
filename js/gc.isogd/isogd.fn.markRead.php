<?php
/**
 * User: Julia Suhinina
 * Date: 08.10.13
 * Time: 16:52
 * Description:
 */

session_start();


if (isset($_SESSION['session_id'])) {
    include 'isogd.db.param.php';
    $db = new PDO($dbString, $dbUser, $dbPass);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->exec("set names latin1");
    $sql = "UPDATE messages SET isread = 1 WHERE Code = " . $_GET['code'] . ";";

    $db->exec($sql);

    echo 'complete!';

}
?>
