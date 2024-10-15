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


if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['selected_siswa'])) {
    $selectedSiswa = json_decode($_POST['selected_siswa'], true);

    if (!empty($selectedSiswa)) {
        // Buat placeholder untuk query
        $placeholders = implode(',', array_fill(0, count($selectedSiswa), '?'));

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
    {$userData['siswa']}.{$userData['nama_siswa_column']}, 
    {$userData['siswa']}.{$userData['id_siswa']}, 
    {$userData['tbname']}.{$userData['id_tagihan']}, 
    {$userData['tbname']}.{$userData['id_siswa_tagihan']}, 
    {$userData['tbname']}.{$userData['tagihan']}, 
    {$userData['tbname']}.{$userData['tanggal_tagihan']}, 
    {$userData['tbname']}.{$userData['tanggal_lunas']}, 
    {$userData['tbname']}.{$userData['lunas']}";

        // Jika kolom name_tagihan ada, tambahkan ke SELECT
        if ($hasNameTagihan) {
            $selectColumns .= ", {$userData['tbname']}.{$userData['name_tagihan']}";
        }

        // Buat query
        $query = "SELECT {$selectColumns}
    FROM 
        {$userData['tbname']}
    JOIN 
        {$userData['siswa']} ON {$userData['tbname']}.{$userData['id_siswa_tagihan']} = {$userData['siswa']}.{$userData['id_siswa']}
    WHERE 
        {$userData['tbname']}.{$userData['id_siswa_tagihan']} IN ($placeholders) 
    AND 
        {$userData['tbname']}.{$userData['lunas']} = 0";

        // Siapkan statement
        $stmt = $conn->prepare($query);



        if ($stmt === false) {
            echo json_encode(['error' => 'Failed to prepare query', 'details' => $conn->error]);
            exit();
        }

        // Bind parameter untuk siswa yang dipilih
        $stmt->bind_param(str_repeat('s', count($selectedSiswa)), ...$selectedSiswa);

        // Eksekusi query
        if (!$stmt->execute()) {
            echo json_encode(['error' => 'Failed to execute query', 'details' => $stmt->error]);
            exit();
        }

        // Ambil hasilnya
        $result = $stmt->get_result();
        $tagihanData = $result->fetch_all(MYSQLI_ASSOC);



        // Kirimkan juga nama kolom untuk digunakan di frontend
        echo json_encode([
            'columns' => [
                'nama_siswa' => $userData['nama_siswa_column'],
                'id_siswa' => $userData['id_siswa'],
                'id_siswa_tagihan' => $userData['id_siswa_tagihan'],
                'id_tagihan' => $userData['id_tagihan'],
                'name_tagihan' => $userData['name_tagihan'],
                'tagihan' => $userData['tagihan'],
                'tanggal_tagihan' => $userData['tanggal_tagihan'],
                'tanggal_lunas' => $userData['tanggal_lunas'],
                'lunas' => $userData['lunas']
            ],
            'data' => $tagihanData

        ]);
    } else {
        echo json_encode([]);
    }
}

$conn->close();
