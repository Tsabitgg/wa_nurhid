function fetchKelasOptions() {
    var sekolah = document.getElementById('sekolah').value;
    console.log(sekolah);

    // Kosongkan dropdown kelas jika tidak ada sekolah yang dipilih
    if (!sekolah) {
        document.getElementById('kelas').innerHTML = '<option value="">Pilih Sekolah Dulu</option>';
        return;
    }

    // Gunakan fetch untuk mengambil data kelas dari server
    fetch('../Config/fetch_kelas.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'sekolah=' + encodeURIComponent(sekolah)
        })
        .then(response => response.text()) // Mengambil respons sebagai teks (HTML <option>)
        .then(data => {
            // Perbarui dropdown kelas dengan data yang diterima dari server
            document.getElementById('kelas').innerHTML = data;
        })
        .catch(error => console.error('Error:', error)); // Tangani error jika ada
}


document.addEventListener('DOMContentLoaded', () => {
    const searchSiswaInput = document.getElementById('search-siswa');
    const filterKelasSelect = document.getElementById('filter-kelas');
    const siswaList = document.getElementById('siswa-list');
    const noSiswaMessage = document.getElementById('no-siswa-message');
    const selectedCount = document.getElementById('selected-count');
    const loadingSiswa = document.getElementById('loading-siswa');


    // Fungsi untuk memuat data siswa berdasarkan filter dan pencarian
    const loadSiswa = (searchQuery = '', filterKelas = '') => {

        loadingSiswa.classList.remove('hidden');

        fetch('../Config/filterSiswa.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'search_query': searchQuery,
                    'filter_kelas': filterKelas
                })
            })
            .then(response => response.text())
            .then(data => {
                siswaList.innerHTML = data;
                restoreSelectedSiswa();

                if (siswaList.children.length === 0) {
                    noSiswaMessage.classList.remove('hidden');
                } else {
                    noSiswaMessage.classList.add('hidden');
                }
                loadingSiswa.classList.add('hidden');
                updateSelectedCount();
            })
            .catch(error => {
                // console.error('Error:', error);
                loadingSiswa.classList.add('hidden');
            });

    };

    // Event listener untuk perubahan input di kolom pencarian
    searchSiswaInput.addEventListener('input', () => {
        const searchQuery = searchSiswaInput.value.trim();
        if (searchQuery === '') {
            loadSiswa('', filterKelasSelect.value); // Memuat siswa tanpa pencarian dan berdasarkan filter kelas
        } else {
            loadSiswa(searchQuery, filterKelasSelect.value);
        }
    });

    // Event listener untuk perubahan pada filter kelas
    filterKelasSelect.addEventListener('change', () => {
        const searchQuery = searchSiswaInput.value.trim();
        loadSiswa(searchQuery, filterKelasSelect.value);
    });

    const updateSelectedSiswa = () => {
        // Ambil semua checkbox siswa yang diceklis
        const checkboxes = Array.from(siswaList.querySelectorAll('input[type="checkbox"]:checked'));

        // Log untuk memeriksa apakah checkbox yang diceklis terambil dengan benar
        // console.log('Checkbox yang diceklis:', checkboxes);

        // Ambil nilai (id_siswa) dari checkbox yang diceklis
        selectedSiswa = checkboxes.map(checkbox => checkbox.value);
        // console.log('ID siswa yang dipilih:', selectedSiswa); // Log untuk memeriksa ID siswa yang dipilih

        // Buat objek selectedSiswaMap yang berisi id_siswa sebagai kunci dan nama_siswa sebagai nilai
        selectedSiswaMap = {};
        selectedSiswa.forEach(siswaId => {
            // Cari checkbox yang sesuai dengan siswaId dan ambil data-nama (nama siswa)
            const siswaCheckbox = siswaList.querySelector(`input[value="${siswaId}"]`);
            if (siswaCheckbox) {
                const siswaName = siswaCheckbox.getAttribute('data-nama');
                selectedSiswaMap[siswaId] = siswaName;
            } else {
                console.warn(`Checkbox dengan siswaId ${siswaId} tidak ditemukan.`);
            }
        });

        // Log untuk melihat hasil akhir selectedSiswaMap
        // console.log('selectedSiswaMap yang diperbarui:', selectedSiswaMap);
    };


    const restoreSelectedSiswa = () => {
        const checkboxes = siswaList.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectedSiswa.includes(checkbox.value);
        });
    };

    const updateSelectedCount = () => {
        const checkedBoxes = siswaList.querySelectorAll('input[type="checkbox"]:checked');
        selectedCount.textContent = checkedBoxes.length;
    };

    const loadBillingData = () => {
        const selectedSiswaIds = Array.from(siswaList.querySelectorAll('input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.value);

        if (selectedSiswaIds.length === 0) {
            billingData.innerHTML = '<tr><td class="py-2 text-center" colspan="5">Tidak ada tagihan ditemukan!</td></tr>';
            reminderBox.textContent = 'Pesan reminder akan muncul disini';
            tagihanCheckedStatus = {}; // Clear all checkboxes status
            updateReminderBox();
            return;
        }

        const loadingAnimation = `<tr>
        <tr>
            <td colspan="5" class="py-4 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" class="mx-auto w-8 h-8">
                    <circle fill="#2B2527" stroke="#2B2527" stroke-width="15" r="15" cx="40" cy="65">
                        <animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate>
                    </circle>
                    <circle fill="#2B2527" stroke="#2B2527" stroke-width="15" r="15" cx="100" cy="65">
                        <animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate>
                    </circle>
                    <circle fill="#2B2527" stroke="#2B2527" stroke-width="15" r="15" cx="160" cy="65">
                        <animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate>
                    </circle>
                </svg>
            </td>
        </tr>`;

        billingData.innerHTML = loadingAnimation;

        fetch('../Config/fetchTagihan.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'selected_siswa': JSON.stringify(selectedSiswaIds)
                })
            })
            .then(response => response.json())
            .then(responseData => {
                columns = responseData.columns;
                const data = responseData.data;

                billingData.innerHTML = '';
                tagihanDataMap = {};

                if (data.length === 0) {
                    billingData.innerHTML = '<tr><td class="py-2 text-center" colspan="5">Tidak ada tagihan ditemukan.</td></tr>';
                    reminderBox.textContent = 'Pesan reminder akan muncul disini';
                    return;
                }

                // Group data by siswa
                const groupedData = data.reduce((acc, tagihan) => {
                    const namaSiswa = tagihan[columns.nama_siswa];
                    if (!acc[namaSiswa]) {
                        acc[namaSiswa] = [];
                    }
                    acc[namaSiswa].push(tagihan);
                    return acc;
                }, {});

                // Render table rows for each siswa and their tagihan
                Object.keys(groupedData).forEach(namaSiswa => {
                    // Add row for siswa name
                    const siswaRow = document.createElement('tr');
                    siswaRow.innerHTML = `<td class="py-2 px-4 font-semibold border-b border-gray-700 bg-gray-100" colspan="6">${namaSiswa}</td>`;
                    billingData.appendChild(siswaRow);

                    // Add rows for tagihan
                    groupedData[namaSiswa].forEach(tagihan => {
                        const idTagihan = tagihan[columns.id_tagihan];
                        const row = document.createElement('tr');
                        const isChecked = tagihanCheckedStatus[idTagihan] || false; // Check if previously checked
                        let No = 1;
                        row.innerHTML = `
            <td class="py-2 px-4 border-b border-gray-300">
                    ${No++}
            </td>
            <td class="py-2 px-4 border-b border-gray-300">${tagihan[columns.name_tagihan] ? tagihan[columns.name_tagihan] : '-'}</td>
            <td class="py-2 px-4 border-b border-gray-300">${tagihan[columns.tanggal_tagihan]}</td>
            <td class="py-2 px-4 border-b border-gray-300">Rp${Number(tagihan[columns.tagihan]).toLocaleString('id-ID')}</td>
            <td class="py-2 px-4 border-b">${tagihan[columns.tanggal_lunas] ? tagihan[columns.tanggal_lunas] : "<span class='inline-block bg-red-500 text-white px-2 py-1 rounded-full text-xs shadow-md'>Unpaid</span>"}</td>
            <td class="py-2 px-4 border-b">${tagihan[columns.lunas] == 1 ? "<span class='inline-block bg-green-500 text-white px-2 py-1 rounded-full text-xs shadow-md'>L</span>" : "<span class='inline-block bg-red-500 text-white px-2 py-1 rounded-full text-xs shadow-md'>B</span>"}</td>
        `;

                        billingData.appendChild(row);

                    });
                });

            })
            .catch(error => {
                console.error('Error fetching billing data:', error);
                billingData.innerHTML = '<tr><td colspan="7">Error fetching data</td></tr>';
            });
    };

    searchSiswaInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    });

    filterKelasSelect.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    });


    loadSiswa();
});