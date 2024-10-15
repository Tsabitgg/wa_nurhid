// Waktu (dalam milidetik) setelah pengguna akan secara otomatis logout
$(document).ready(function() {
    function updateStatus() {
        $.ajax({
            type: 'GET',
            url: '', // leave empty or use a specific URL if needed
            dataType: 'json',
            success: function(response) {
                response.forEach(function(item) {
                    var statusBadge = '';
                    if (item.status === 'pending') {
                        statusBadge = "<span class='inline-block bg-yellow-500 text-white px-2 py-1 rounded-full text-xs shadow-md'>Pending</span>";
                    } else if (item.status === 'berhasil') {
                        statusBadge = "<span class='inline-block bg-green-500 text-white px-2 py-1 rounded-full text-xs shadow-md'>Berhasil</span>";
                    } else if (item.status === 'gagal') {
                        statusBadge = "<span class='inline-block bg-red-500 text-white px-2 py-1 rounded-full text-xs shadow-md'>Gagal</span>";
                    }
                    $('td[data-log-id="' + item.id + '"]').html(statusBadge);
                });
            },
            error: function(xhr, status, error) {
                console.error('Failed to fetch status:', error);
            }
        });
    }

    // Initial status update
    updateStatus();

    // Update status every 30 seconds
    setInterval(updateStatus, 30000);
});


const autoLogoutTime = 30 * 60 * 1000; 

let logoutTimer;

function resetLogoutTimer() {
    // Hapus timer yang ada
    clearTimeout(logoutTimer);

    // Setel ulang timer
    logoutTimer = setTimeout(logoutUser, autoLogoutTime);
}

function logoutUser() {
    // Redirect ke halaman logout
    window.location.href = 'logout.php';
}

// Daftar aktivitas pengguna yang akan menyetel ulang timer
window.onload = resetLogoutTimer;
document.onmousemove = resetLogoutTimer; // Mouse bergerak
document.onkeypress = resetLogoutTimer;  // Ketikan
document.onclick = resetLogoutTimer;     // Klik
document.onscroll = resetLogoutTimer;    // Scroll