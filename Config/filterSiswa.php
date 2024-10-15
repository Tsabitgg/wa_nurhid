<?php
session_start();
require_once 'db.php';

if (!isset($_SESSION['logged_in'])) {
    header('Location: login.php');
    exit();
}

$userData = $_SESSION['user_data'];
$username = $userData['username'];

$conn = getDbConnection($userData['host'], $userData['userdb'], $userData['passdb'], $userData['dbname']);

$siswaTable = $userData['siswa'];
$namaSiswaColumn = $userData['nama_siswa_column'];
$kelasColumn = $userData['kelas'];
$jenjangColumn = $userData['jenjang'];
$phoneNumberColumn = $userData['phone_column'];
$columnId = $userData['id_siswa'];

$searchQuery = $_POST['search_query'] ?? '';
$filterKelas = str_replace(' ', '', $_POST['filter_kelas'] ?? '');

if (!empty($filterKelas)) {
    if (!empty($jenjangColumn)) {
        // Query dengan filter jenjang, kelas, dan pencarian
        $sql = "SELECT $columnId, $namaSiswaColumn 
                FROM $siswaTable 
                WHERE $namaSiswaColumn LIKE ? 
                  AND REPLACE(CONCAT_WS(' ', $jenjangColumn, $kelasColumn), ' ', '') LIKE ?";
        $stmt = $conn->prepare($sql);

        // Bind parameter dengan wildcard
        $searchQuery = "%$searchQuery%";
        $filterKelas = "%$filterKelas%";
        $stmt->bind_param("ss", $searchQuery, $filterKelas);
    } else {
        // Query tanpa filter jenjang, hanya filter kelas dan pencarian
        $sql = "SELECT $columnId, $namaSiswaColumn 
                FROM $siswaTable 
                WHERE $namaSiswaColumn LIKE ? 
                  AND $kelasColumn LIKE ?";
        $stmt = $conn->prepare($sql);

        // Bind parameter dengan wildcard
        $searchQuery = "%$searchQuery%";
        $filterKelas = "%$filterKelas%";
        $stmt->bind_param("ss", $searchQuery, $filterKelas);
    }
} else {
    // Query tanpa filter kelas dan jenjang, cuman pencarian dari kolom search siswa
    $sql = "SELECT $columnId, $namaSiswaColumn 
            FROM $siswaTable 
            WHERE $namaSiswaColumn LIKE ?";
    $stmt = $conn->prepare($sql);
    $searchQuery = "%$searchQuery%";
    $stmt->bind_param("s", $searchQuery);
}

$stmt->execute();
$result = $stmt->get_result();

$siswaOptions = '';
while ($row = $result->fetch_assoc()) {
    // Pastikan kolom nomor WhatsApp ditarik

    $inputId = "siswa_option_" . htmlspecialchars($row[$columnId]);
    $siswaOptions .= '<div class="flex items-center">
                    <input type="checkbox" id="' . $inputId . '" class="peer mr-2 appearance-none h-4 w-4 border-2 rounded-full hover:border-teal-500 cursor-pointer border-teal-300" name="siswa[]" value="' . htmlspecialchars($row[$columnId]) . '">
                    <label for="' . $inputId . '" class="flex items-center w-full p-1 border-b rounded cursor-pointer transition-colors duration-200 hover:bg-teal-600 hover:text-white peer-checked:bg-green-500 peer-checked:text-white">' . htmlspecialchars($row[$namaSiswaColumn]) . '</label>
                </div>';
}

echo $siswaOptions;

$conn->close();