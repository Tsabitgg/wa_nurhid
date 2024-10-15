<?php

session_start();
require_once 'db.php';

header('Content-Type: application/json');

if (!isset($_SESSION['logged_in'])) {
    header('Location: login.php');
    exit();
}

$userData = $_SESSION['user_data'];
$username = $userData['username'];

// Koneksi menggunakan mysqli
$conn = getDbConnection($userData['host'], $userData['userdb'], $userData['passdb'], $userData['dbname']);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['angkatan'])) {
    $angkatanId = $_POST['angkatan'];

    if (!empty($angkatanId)) {
        // Fungsi untuk mengecek apakah kolom ada di tabel
        function checkColumnExists($conn, $table, $column)
        {
            $result = $conn->query("SHOW COLUMNS FROM {$table} LIKE '{$column}'");
            return $result->num_rows > 0;
        }

        // Cek apakah userData['name_tagihan'] ada dan tidak kosong
        if (!empty($userData['name_tagihan'])) {
            // Cek apakah kolom name_tagihan ada di tabel
            $hasNameTagihan = checkColumnExists($conn, $userData['tbname'], $userData['name_tagihan']);
        } else {
            // Jika name_tagihan kosong, anggap tidak ada
            $hasNameTagihan = false;
        }

        // Buat bagian SELECT dinamis
        $selectColumns = "
            s.{$userData['nama_siswa_column']} AS nama_siswa, 
            s.{$userData['id_siswa']} AS id_siswa, 
            s.{$userData['phone_column']} AS phone_column, 
            t.{$userData['id_tagihan']} AS id_tagihan, 
            t.{$userData['id_siswa_tagihan']} AS id_siswa_tagihan, 
            t.{$userData['tagihan']} AS tagihan, 
            t.{$userData['tanggal_tagihan']} AS tanggal_tagihan, 
            t.{$userData['tanggal_lunas']} AS tanggal_lunas, 
            t.{$userData['lunas']} AS lunas";
            

        // Jika kolom name_tagihan ada, tambahkan ke SELECT
        if ($hasNameTagihan) {
            $selectColumns .= ", t.{$userData['name_tagihan']} AS name_tagihan";
        }
        // Query untuk mendapatkan data tagihan siswa berdasarkan kelas yang dipilih
        $query = "
            SELECT 
                {$selectColumns}
            FROM 
                {$userData['tbname']} t
            JOIN 
                {$userData['siswa']} s ON t.{$userData['id_siswa_tagihan']} = s.{$userData['id_siswa']}
            WHERE 
                s.{$userData['angkatan']} = ? 
            AND 
                t.{$userData['lunas']} = 0
        ";

        // Siapkan statement
        $stmt = $conn->prepare($query);

        if ($stmt === false) {
            echo json_encode(['error' => 'Failed to prepare query', 'details' => $conn->error]);
            exit();
        }

        // Bind parameter (kelas yang dipilih)
        $stmt->bind_param('s', $angkatanId);

        // Eksekusi query
        if (!$stmt->execute()) {
            echo json_encode(['error' => 'Failed to execute query', 'details' => $stmt->error]);
            exit();
        }

        // Ambil hasil query
        $result = $stmt->get_result();
        $tagihanData = $result->fetch_all(MYSQLI_ASSOC);

        if (!empty($tagihanData)) {
            // Kirim hasilnya sebagai JSON
            echo json_encode($tagihanData);
        } else {
            echo json_encode(['message' => 'Tidak ada tagihan yang ditemukan']);
        }

        // Tutup statement
        $stmt->close();
    } else {
        echo json_encode(['error' => 'Angkatan tidak dipilih']);
    }
}

$conn->close();
