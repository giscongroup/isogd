<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Julia Suhinina
 * Date: 12.08.13
 * Time: 15:11
 * Description: set open_basedir and upload_tmp_dir in /etc/php5/fpm/php.ini (open_basedir should be parent folder for upload_tmp_dir)
 */
session_start();

if (isset($_SESSION['session_id'])) {

//    $db = new PDO('sqlite:db/isogd.db');
    include 'isogd.db.param.php';
    $db = new PDO($dbString, $dbUser, $dbPass);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->exec("set names latin1");
    $data = date("c");

    $newFilesIDs = array();

    $sql = "UPDATE files SET deleteDate = '" . $data . "' WHERE ID = " . $_SESSION['session_id'] . ";";
    $db->exec($sql);


    foreach ($_FILES as $file) {
        if (isset($file['name']) && $file['size'] > 0 && $file['error'] == 0) {
            $data = date("c");
            $dir = getcwd() . "/files/" . $_SESSION['session_id'];

//            $expFilename = explode('.', $file["name"]);
//            $fileName = str_replace(' ', '_', $_GET['filename']);
//            if (count($expFilename) > 1)
//                $name = $fileName . '.' . $expFilename[count($expFilename) - 1];
//            else

            $name = $file["name"];
            $name = str_replace(' ', '_', $name);

            $sql = "INSERT INTO files(ID, filename, createDate) values (" . $_SESSION['session_id'] . ", '" . $name . "', '" . $data . "');";
            $db->exec($sql);


            $newID = $db->lastInsertId();
            $newFilesIDs[] = $newID;

            $dirpath = str_replace('\\', '/', substr(getcwd(), strlen($_SERVER['DOCUMENT_ROOT'])));
            $sql = "UPDATE files SET url = '" . $dirpath . "/files/" . $_SESSION['session_id'] . "/" . $newID . "_" . $name . "' WHERE Code = " . $newID . ";";
            $db->exec($sql);

           // if ($_SESSION['os'] === 1)
            //    $name = iconv('utf-8', 'windows-1251', $name);

            if (!file_exists($dir)) {
                mkdir($dir, 0777, true);
            }
            move_uploaded_file(
                $file["tmp_name"],
                $dir . "/" . $newID . "_" . $name
            ) or die("Problems with save file");

        } else {
            echo 'Error, file not obtained';
        }
    }
    echo json_encode($newFilesIDs);
}
?>