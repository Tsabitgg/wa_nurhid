<?php
session_start();
require 'db.php';

if (!isset($_SESSION['logged_in'])) {
    header('Location: login.php');
    exit();
}

$userData = $_SESSION['user_data'];
$username = $userData['username'];

$conn = getDbConnection($userData['host'], $userData['userdb'], $userData['passdb'], $userData['dbname']);

if (isset($_POST['sekolah'])) {

    $sekolah = $_POST['sekolah'];
    

    // Kolom dinamis dari user_data, misalnya:
    $jenjang = $userData['jenjang'];
    $tables = $userData['siswa'];
    $sekolahColumn = $userData['sekolah'];
    $kelasColumn = $userData['kelas']; // Ini bisa dinamis

    // Query yang dinamis berdasarkan user_data
    // $query = "
    //     SELECT 
    //         CASE 
    //             WHEN $jenjang IS NOT NULL AND $kelasColumn IS NOT NULL THEN CONCAT($jenjang, ' ', $kelasColumn)
    //             WHEN $jenjang IS NOT NULL THEN $jenjang
    //             ELSE $kelasColumn
    //         END AS kelas_combined
    //     FROM  $tables
    //     WHERE $sekolahColumn = ?
    // ";

    // $stmt = $conn->prepare($query);
    // $stmt->bind_param("s", $sekolah);
    // $stmt->execute();
    // $result = $stmt->get_result();

    // // Output opsi kelas
    // echo '<option value="">Pilih Kelas</option>';
    // while ($row = $result->fetch_assoc()) {
    //     // Mengambil data gabungan atau individu
    //     echo '<option value="' . htmlspecialchars($row['kelas_combined']) . '">' . htmlspecialchars($row['kelas_combined']) . '</option>';
    // }

    // $stmt->close();
     // Membuat query dinamis berdasarkan kondisi jenjang dan kelas
     if (!empty($jenjang) && !empty($kelasColumn)) {
        // Jika jenjang dan kelas keduanya ada, gabungkan keduanya
        $query = "
            SELECT DISTINCT CONCAT($jenjang, ' ', $kelasColumn) AS kelas_combined 
            FROM $tables 
            WHERE $sekolahColumn = ? ORDER BY $jenjang DESC
        ";
    } elseif (!empty($jenjang)) {
        // Jika hanya jenjang yang ada
        $query = "
            SELECT DISTINCT $jenjang AS kelas_combined 
            FROM $tables 
            WHERE $sekolahColumn = ? ORDER BY $jenjang DESC
        ";
    } elseif (!empty($kelasColumn)) {
        // Jika hanya kelas yang ada
        $query = "
            SELECT DISTINCT $kelasColumn AS kelas_combined 
            FROM $tables 
            WHERE $sekolahColumn = ? ORDER BY $kelasColumn DESC
        ";
    } else {
        // Jika keduanya tidak ada, Anda bisa menampilkan error atau nilai default
        echo '<option value="">Tidak ada kelas tersedia</option>';
        exit();
    }

    // Siapkan statement dan jalankan query
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $sekolah);
    $stmt->execute();
    $result = $stmt->get_result();

    // Output opsi kelas
    echo '<option value="">Pilih Kelas</option>';
    while ($row = $result->fetch_assoc()) {
        // Mengambil data gabungan atau individu
        echo '<option value="' . htmlspecialchars($row['kelas_combined']) . '">' . htmlspecialchars($row['kelas_combined']) . '</option>';
    }

    $stmt->close();
}
?>

