<?php
/**
 * User: Julia Suhinina
 * Date: 03.10.13
 * Time: 9:31
 * Description:
 */
session_start();

if (isset($_SESSION['session_id'])) {
    try {
//    $db = new PDO('sqlite:db/isogd.db');
        $post_data = json_decode(file_get_contents('php://input'), true);
        include 'isogd.db.param.php';
        $db = new PDO($dbString, $dbUser, $dbPass);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $db->exec("set names latin1");
        $fields = "";
        $values = "";
        $sep = ", ";


        /////////////////////////собираем недостающие поля для лога  /////////////////////////////////////////////////
        $newdate = $post_data['week'] . 'T00:00:00.000Z';

        $sql = "SELECT * FROM isogdarch WHERE ID = " . $_SESSION['session_id'] . " AND CreateDate <= '" . $newdate . "' ORDER BY CreateDate DESC LIMIT 1;";
        $cur = $db->query($sql);

        $ex = false;

        foreach ($cur as $r) {
            $ex = true;
            foreach ($r as $name => $value) {

                if (isset($post_data [$name]) == false && $name !== 'Code' && $name !== 'ID') {
                    $post_data [$name] = $value;
                }
            }
        }

        if ($ex === false) {
            $sql = "SELECT * FROM isogdarch WHERE ID = " . $_SESSION['session_id'] . " AND CreateDate >= '" . $newdate . "' ORDER BY CreateDate ASC LIMIT 1;";
            $cur = $db->query($sql);

            foreach ($cur as $r) {
                foreach ($r as $name => $value) {
                    if (isset($post_data [$name]) == false && $name !== 'Code' && $name !== 'ID') {
                        $post_data [$name] = $value;
                    }
                }
            }

        }


        /////////////////////////////////////////////делаем запись в архив////////////////////////////////////////////////////
        $cur = $db->query("DESCRIBE isogdarch");


        foreach ($cur as $r) {
            if ($r["Field"] !== 'Code' && $r["Field"] !== 'ID') {
                if (is_null($post_data[$r["Field"]]) != true && $post_data[$r["Field"]] !== "") {

                    if ($fields !== "")
                        $fields = $fields . $sep . $r["Field"];
                    else
                        $fields = $r["Field"];

                    if ($values !== "")
                        $values = $values . $sep . "'" . $post_data[$r["Field"]] . "'";
                    else
                        $values = "'" . $post_data[$r["Field"]] . "'";
                }
            }
        }

        $sql = "INSERT INTO isogdarch(" . $fields . ", ID) values (" . $values . ", " . $_SESSION['session_id'] . ");";

        $db->exec($sql);

        $cur = $db->query("DESCRIBE isogdweek");


        if (is_null($post_data['Code']) == true) {
            /////////////////////////////////////////////////////////////////////////////////////////////////

            $currentWeek = explode('-', $post_data['week']);

            if ($currentWeek[2] <= 15) {
                $fromDate = $currentWeek[0] . "-" . ($currentWeek[1] - 1) . "-15";
                $toDate = $currentWeek[0] . "-" . ($currentWeek[1] - 1) . "-32";
            } else {
                $fromDate = $currentWeek[0] . "-" . $currentWeek[1] . "-00";
                $toDate = $currentWeek[0] . "-" . $currentWeek[1] . "-15";
            }

            $sql = "SELECT max(week), ID FROM isogdweek WHERE week < '" . $post_data['week'] . "'  GROUP BY ID;";
            $cur = $db->query($sql);
            $moData = array();
            foreach ($cur as $r) {
                $moData[$r['ID']] = $r['max(week)'];
            }

            $sql = "SELECT min(week), ID FROM isogdweek WHERE week > '" . $post_data['week'] . "'  GROUP BY ID;";
            $cur = $db->query($sql);

            foreach ($cur as $r) {
                if (is_null($moData[$r['ID']])) {
                    $moData[$r['ID']] = $r['min(week)'];
                }
            }


            foreach ($moData as $id => $value) {
                $fields = "";
                $values = "";

                if ($id == $_SESSION['session_id']) {
                    $cur = $db->query("DESCRIBE isogdweek");
                    foreach ($cur as $r) {
                        if ($r["Field"] !== 'Code' && $r["Field"] !== 'week') {
                            if (is_null($post_data[$r["Field"]]) != true && $post_data[$r["Field"]] !== "") {

                                if ($fields !== "")
                                    $fields = $fields . $sep . $r["Field"];
                                else
                                    $fields = $r["Field"];

                                if ($values !== "")
                                    $values = $values . $sep . "'" . $post_data[$r["Field"]] . "'";
                                else
                                    $values = "'" . $post_data[$r["Field"]] . "'";
                            }
                        }
                    }
                } else {
                    $sql = "SELECT * FROM isogdweek WHERE week = '" . $value . "' AND ID=" . $id . ";";
                    $cur = $db->query($sql);
                    foreach ($cur as $r) {
                        foreach ($r as $nameF => $valueF) {
                            if ($nameF !== 'Code' && gettype($nameF) == "string" && $nameF !== 'ID' && $nameF !== 'week') {

                                if ($fields !== "")
                                    $fields = $fields . $sep . $nameF;
                                else
                                    $fields = $nameF;

                                if ($values !== "")
                                    $values = $values . $sep . "'" . $valueF . "'";
                                else
                                    $values = "'" . $valueF . "'";

                            }
                        }
                    }
                }


                $sql = "INSERT INTO isogdweek(" . $fields . ", week, ID) values (" . $values . ", '" . $post_data['week'] . "', " . $id . ");";

                $db->exec($sql);
            }

            ////////////////////////////////////если нет, то insert ///////////////////////////////////////
//            $fields = "";
//            $values = "";
//
//            $cur = $db->query("DESCRIBE isogdweek");
//
//            foreach ($cur as $r) {
//                if ($r["Field"] !== 'Code') {
//                    if (is_null($post_data[$r["Field"]]) != true && $post_data[$r["Field"]] !== "") {
//
//                        if ($fields !== "")
//                            $fields = $fields . $sep . $r["Field"];
//                        else
//                            $fields = $r["Field"];
//
//                        if ($values !== "")
//                            $values = $values . $sep . "'" . $post_data[$r["Field"]] . "'";
//                        else
//                            $values = "'" . $post_data[$r["Field"]] . "'";
//                    }
//                }
//            }
//            $sql = "INSERT INTO isogdweek(" . $fields . ", ID) values (" . $values . ", " . $_SESSION['session_id'] . ");";
//
//
//            $db->exec($sql);

        } else {
            $fields = "";
            /////////////////////////////////////// ЕСЛИ ЗАПИСЬ УЖЕ ЕСТЬ В БАЗЕ, ТО UPDATE //////////////////////////////////
            $cur = $db->query("DESCRIBE isogdweek");
            foreach ($cur as $r) {
                if ($r["Field"] !== 'Code') {
                    if (is_null($post_data[$r["Field"]]) != true && $post_data[$r["Field"]] !== "") {

                        if ($fields !== "")
                            $fields = $fields . $sep . $r["Field"] . '=' . "'" . $post_data[$r["Field"]] . "'";
                        else
                            $fields = $r["Field"] . '=' . "'" . $post_data[$r["Field"]] . "'";

                    } else {
                        if ($fields !== "")
                            $fields = $fields . $sep . $r["Field"] . '=' . "''";
                        else
                            $fields = $r["Field"] . '=' . "''";
                    }
                }
            }
            $sql = "UPDATE isogdweek SET " . $fields . " WHERE Code =" . $post_data['Code'] . ";";

            $db->exec($sql);
        }
        echo 'Complete!';
    } catch
    (Exception $e) {

        echo 'Выброшено исключение: ', $e->getMessage(), "\n";
    }
}
?>