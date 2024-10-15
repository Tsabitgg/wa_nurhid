

document.getElementById('hamburger').addEventListener('click', function () {
    var sidebar = document.getElementById('sidebar');
    var mainContent = document.getElementById('main-content');
    const topBar = document.getElementById('top-bar');
    const headerBar = document.getElementById('header-bar');
    const headerTitle = document.getElementById('header-title');
    
    sidebar.classList.toggle('hidden');
    if (sidebar.classList.contains('hidden')) {
        mainContent.classList.remove('ml-14', 'sm:ml-60');
        topBar.classList.remove('sm:ml-60');
        headerBar.classList.remove('sm:ml-60');
        headerTitle.classList.add('sm:ml-10');
    } else {
        mainContent.classList.add('ml-14', 'sm:ml-60');
        topBar.classList.add('sm:ml-60');
        headerBar.classList.add('sm:ml-60');
        headerTitle.classList.remove('sm:ml-10');
        headerTitle.classList.add('sm:ml-10');
    }
});


function handleSubmit(event) {
    event.preventDefault();
    const button = document.getElementById('loginButton');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const notification = document.getElementById('notification');
    
    button.innerHTML = `
        <svg class="animate-spin w-7 h-7 mr-2" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <circle cx="400" cy="400" fill="none" r="250" stroke-width="110" stroke="#919abf" stroke-dasharray="1276 1400" />
        </svg>
        Processing...
    `;
    button.disabled = true;

    // Reset error messages and styles
    username.classList.remove('border-red-500');
    password.classList.remove('border-red-500');

    let hasError = false;

    if (username.value === '') {
        username.classList.add('border-red-500');
        hasError = true;
    }

    if (password.value === '') {
        password.classList.add('border-red-500');
        hasError = true;
    }

    if (hasError) {
        button.innerHTML = 'Sign in';
        button.disabled = false;
        return;
    }
    
    const form = event.target;
    fetch('../Config/auth.php', {
        method: 'POST',
        body: new FormData(form)
    })
    .then(response => response.json())
    .then(data => {
        button.innerHTML = 'Sign in';
        button.disabled = false;
        
        if (data.success) {
            // Display success notification
            notification.innerHTML = `
                <div class="bg-green-500 text-white px-4 py-3 rounded-md flex items-center space-x-4">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <div class="flex-1">
                        <span class="font-bold">Success</span>
                        <p class="text-sm">Login successful! Redirecting...</p>
                    </div>
                    <button class="ml-auto focus:outline-none" onclick="this.parentElement.remove();">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            `;
            notification.style.display = 'block';

            // Redirect to homepage after a short delay
            setTimeout(() => {
                window.location.href = 'kirimWA.php';
            }, 2000);
        } else {
            notification.innerHTML = `
                <div class="bg-red-500 text-white px-4 py-3 rounded-md flex items-center space-x-4">
                    <div class="flex-1">
                        <span class="font-bold">Failed</span>
                        <p class="text-sm">${data.message || 'Login failed. Please try again.'}</p>
                    </div>
                    <button class="ml-auto focus:outline-none" onclick="this.parentElement.remove();">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            `;
            notification.style.display = 'block';

            // Remove notification after a short delay
            setTimeout(() => {
                notification.innerHTML = '';
            }, 3000); // 3 seconds delay before removing the notification

        }
    })
    .catch(error => {
        button.innerHTML = 'Sign in';
        button.disabled = false;
        notification.innerHTML = `
            <div class="bg-red-500 text-white px-4 py-3 rounded-md flex items-center space-x-4">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <div class="flex-1">
                    <span class="font-bold">Error</span>
                    <p class="text-sm">An error occurred. Please try again later.</p>
                </div>
                <button class="ml-auto focus:outline-none" onclick="this.parentElement.remove();">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;
        notification.style.display = 'block';

        setTimeout(() => {
            notification.innerHTML = '';
        }, 3000);
    });
}


//scrollicon top
// 

//toast_message
document.addEventListener('DOMContentLoaded', function() {
    const toastMessage = document.getElementById('toastMessage');

    if (toastMessage) {
        // Menampilkan toast message dengan animasi
        setTimeout(() => {
            toastMessage.classList.add('opacity-100', 'translate-x-0');
        }, 100);

        // Menghilangkan toast message setelah 5 detik
        setTimeout(() => {
            toastMessage.classList.remove('opacity-100');
            toastMessage.classList.add('opacity-0');
            setTimeout(() => {
                if (toastMessage) {
                    toastMessage.remove();
                }
            }, 300); // Waktu untuk efek hilang
        }, 5000); // Waktu untuk menampilkan toast (5 detik)
    }
});



document.addEventListener('DOMContentLoaded', function() {
    function updateFormFields(method) {
        // Reset semua field
        document.getElementById('siswa').style.display = 'none';
        document.getElementById('sekolah').style.display = 'none';
        document.getElementById('kelas').style.display = 'none';
        document.getElementById('angkatan').style.display = 'none';

        // Tampilkan field yang relevan berdasarkan metode
        if (method === 'SEND_SISWA') {
            document.getElementById('siswa').style.display = 'block';
        } else if (method === 'SEND_KELAS') {
            document.getElementById('sekolah').style.display = 'block';
            document.getElementById('kelas').style.display = 'block';
        } else if (method === 'SEND_ANGKATAN') {
            document.getElementById('angkatan').style.display = 'block';
        }
    }

    function updateSelectedCount() {
        // Hitung jumlah checkbox yang dipilih
        const checkboxes = document.querySelectorAll('input[name="siswa[]"]:checked');
        document.getElementById('selected-count').textContent = checkboxes.length;
    }

    // Atur event change pada dropdown metode
    document.getElementById('method').addEventListener('change', function() {
        updateFormFields(this.value);
    });

    // Event listener untuk div yang mengandung checkbox
    document.querySelectorAll('#siswa-list .flex').forEach(function(div) {
        div.addEventListener('click', function(event) {
            const checkbox = div.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;

            // Ubah warna checkbox saat dipilih
            if (checkbox.checked) {
                div.classList.add('bg-transparent', 'text-white');
            } else {
                div.classList.remove('bg-transparent', 'text-white');
            }
            // Perbarui jumlah siswa yang dipilih
            updateSelectedCount();
        });
    });

    // Event listener untuk checkbox langsung
    document.getElementById('siswa').addEventListener('change', function(event) {
        if (event.target.type === 'checkbox') {
            // Ubah warna checkbox saat dipilih
            if (event.target.checked) {
                event.target.parentElement.classList.add('bg-transparent', 'text-white');
            } else {
                event.target.parentElement.classList.remove('bg-transparent', 'text-white');
            }
            // Perbarui jumlah siswa yang dipilih
            updateSelectedCount();
        }
    });
});

// Waktu (dalam milidetik) setelah pengguna akan secara otomatis logout
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













