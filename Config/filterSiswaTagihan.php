<?php
session_start();
require_once 'db.php';

if (!isset($_SESSION['logged_in'])) {
    header('Location: login.php');
    exit();
}

header('Content-Type: application/json');

$userData = $_SESSION['user_data'];
$username = $userData['username'];

$conn = getDbConnection($userData['host'], $userData['userdb'], $userData['passdb'], $userData['dbname']);

$siswaTable = $userData['siswa'];
$namaSiswaColumn = $userData['nama_siswa_column'];
$kelasColumn = $userData['kelas'];
$jenjangColumn = $userData['jenjang'];
$phoneNumberColumn = $userData['phone_column'];
$columnId = $userData['id_siswa'];
$sekolahColumn = $userData['sekolah'];

$searchQuery = $_POST['search_query'] ?? '';
$filterKelas = str_replace(' ', '', $_POST['filter_kelas'] ?? ''); 

$siswaOptions = '';
$kelasOptions = '';

if (isset($_POST['sekolah'])) {
    $sekolah = $_POST['sekolah'];

    // Bagian untuk query siswa
    if (!empty($filterKelas)) {
        if (!empty($jenjangColumn)) {
            // Query dengan filter jenjang, kelas, dan pencarian
            $sql = "SELECT $columnId, $namaSiswaColumn 
                    FROM $siswaTable 
                    WHERE $namaSiswaColumn LIKE ? 
                      AND REPLACE(CONCAT_WS(' ', $jenjangColumn, $kelasColumn), ' ', '') LIKE ? 
                      AND $sekolahColumn = ?";
            $stmt = $conn->prepare($sql);
    
            // Bind parameter dengan wildcard
            $searchQuery = "%$searchQuery%";
            $filterKelas = "%$filterKelas%";
            $stmt->bind_param("sss", $searchQuery, $filterKelas, $sekolah);
        } else {
            // Query tanpa filter jenjang, hanya filter kelas dan pencarian
            $sql = "SELECT $columnId, $namaSiswaColumn 
                    FROM $siswaTable 
                    WHERE $namaSiswaColumn LIKE ? 
                      AND $kelasColumn LIKE ? 
                      AND $sekolahColumn = ?";
            $stmt = $conn->prepare($sql);
    
            // Bind parameter dengan wildcard
            $searchQuery = "%$searchQuery%";
            $filterKelas = "%$filterKelas%";
            $stmt->bind_param("sss", $searchQuery, $filterKelas, $sekolah);
        }
    } else {
        // Query tanpa filter kelas dan jenjang, hanya pencarian dari kolom search siswa dan filter sekolah
        $sql = "SELECT $columnId, $namaSiswaColumn 
                FROM $siswaTable 
                WHERE $namaSiswaColumn LIKE ? 
                  AND $sekolahColumn = ?";
        $stmt = $conn->prepare($sql);
        $searchQuery = "%$searchQuery%";
        $stmt->bind_param("ss", $searchQuery, $sekolah);
    }

    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $inputId = "siswa_option_" . htmlspecialchars($row[$columnId]);
            $siswaOptions .= '<div class="flex items-center">
                            <input type="checkbox" id="' . $inputId . '" class="peer mr-2 appearance-none h-4 w-4 border-2 rounded-full hover:border-teal-500 cursor-pointer border-teal-300" name="siswa[]" value="' . htmlspecialchars($row[$columnId]) . '">
                            <label for="' . $inputId . '" class="flex items-center w-full p-1 border-b rounded cursor-pointer transition-colors duration-200 hover:bg-teal-600 hover:text-white peer-checked:bg-green-500 peer-checked:text-white">' . htmlspecialchars($row[$namaSiswaColumn]) . '</label>
                        </div>';
        }
    } else {
        $siswaOptions = '<p class="text-gray-500">Tidak ada siswa yang ditemukan untuk sekolah ini</p>';
    }

    // Bagian untuk query kelas
    if (!empty($jenjangColumn) && !empty($kelasColumn)) {
        $query = "
            SELECT DISTINCT CONCAT($jenjangColumn, ' ', $kelasColumn) AS kelas_combined 
            FROM $siswaTable 
            WHERE $sekolahColumn = ? ORDER BY $jenjangColumn DESC
        ";
    } elseif (!empty($jenjangColumn)) {
        $query = "
            SELECT DISTINCT $jenjangColumn AS kelas_combined 
            FROM $siswaTable 
            WHERE $sekolahColumn = ? ORDER BY $jenjangColumn DESC
        ";
    } elseif (!empty($kelasColumn)) {
        $query = "
            SELECT DISTINCT $kelasColumn AS kelas_combined 
            FROM $siswaTable 
            WHERE $sekolahColumn = ? ORDER BY $kelasColumn DESC
        ";
    } else {
        $kelasOptions = '<option value="">Tidak ada kelas tersedia</option>';
    }

    if (!empty($query)) {
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $sekolah);
        $stmt->execute();
        $result = $stmt->get_result();

        $kelasOptions .= '<option value="">Pilih Kelas</option>';
        while ($row = $result->fetch_assoc()) {
            $kelasOptions .= '<option value="' . htmlspecialchars($row['kelas_combined']) . '">' . htmlspecialchars($row['kelas_combined']) . '</option>';
        }

        $stmt->close();
    }

    $conn->close();

    // Kirimkan respon sebagai JSON
    echo json_encode([
        'siswaOptions' => $siswaOptions,
        'kelasOptions' => $kelasOptions
    ]);
}
