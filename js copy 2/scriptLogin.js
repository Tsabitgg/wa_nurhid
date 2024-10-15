
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














