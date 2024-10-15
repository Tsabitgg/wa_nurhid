<?php
function fetchDropdownOptions($conn, $table, $column) {
    $options = [];
    $result = $conn->query("SELECT DISTINCT $column FROM $table ORDER BY $column ASC");
    while ($row = $result->fetch_assoc()) {
        $options[] = $row[$column];
    }
    return $options;
}


function fetchDropdownClassOptions($conn, $table, $jenjang = null, $kelas = null, $isConcat = false) {
    $options = [];

    //periksa kolom di tabel
    $columns = [];
    $result = $conn->query("SHOW COLUMNS FROM $table");
    while ($row = $result->fetch_assoc()) {
        $columns[] = $row['Field'];
    }

    //modif query berdasarkan kolom
    if ($isConcat && $jenjang && $kelas) {
        if (in_array($jenjang, $columns) && in_array($kelas, $columns)) {
            $result = $conn->query("SELECT DISTINCT CONCAT($jenjang, ' ', $kelas) AS $jenjang FROM $table ORDER BY $jenjang ASC");
        } elseif (in_array($jenjang, $columns)) {
            $result = $conn->query("SELECT DISTINCT $jenjang FROM $table ORDER BY $jenjang ASC");
        } else {
            return $options;
        }
    } else {
        if ($kelas && in_array($kelas, $columns)) {
            $result = $conn->query("SELECT DISTINCT $kelas FROM $table ORDER BY $kelas ASC");
        } else {
            return $options;
        }
    }

    while ($row = $result->fetch_assoc()) {
        $options[] = isset($row[$kelas]) ? $row[$kelas] : $row[$jenjang];
    }
    
    return $options;
}

?>