function fetchKelasOptions() {
    var sekolah = document.getElementById('sekolah').value;
   

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


function fetchSiswaOptions() {
    const sekolah = document.getElementById('sekolahSiswa').value;

    
    if (!sekolah) {
        // Jika tidak ada sekolah yang dipilih, tampilkan pesan
        document.getElementById('siswa-list').innerHTML = '<p class="text-gray-500">Silakan pilih sekolah dulu</p>';
        document.getElementById('filter-kelas').innerHTML = '<option value="">Semua Kelas</option>';

        return;
    }

    fetch('../Config/filterSiswaTagihan.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'sekolah=' + encodeURIComponent(sekolah)
        })
        .then(response => response.json()) // Mengambil respons sebagai teks (HTML <option>)
        .then(data => {

            
            // Perbarui dropdown kelas dengan data yang diterima dari server
            document.getElementById('siswa-list').innerHTML = data.siswaOptions;
            document.getElementById('filter-kelas').innerHTML = data.kelasOptions;
        })
        .catch(error => console.error('Error:', error)); // Tangani error jika ada
}




document.addEventListener('DOMContentLoaded', () => {
    const searchSiswaInput = document.getElementById('search-siswa');
    const filterKelasSelect = document.getElementById('filter-kelas');
    const sekolahSelect = document.getElementById('sekolahSiswa');
    const siswaList = document.getElementById('siswa-list');
    const noSiswaMessage = document.getElementById('no-siswa-message');
    const selectedCount = document.getElementById('selected-count');
    const billingTable = document.getElementById('tagihanTable');
    const billingData = document.getElementById('dataTagihan');
    const reminderBox = document.getElementById('reminderbox');
    const loadingSiswa = document.getElementById('loading-siswa');


    let selectedSiswa = [];
    let columns = {};
    let tagihanCheckedStatus = {};
    let tagihanDataMap = {};
    let selectedSiswaMap = {};
    let selectedTagihanOrder = [];


    const reminderTemplates = [
        "Assalamualaikum Wr Wb,\n\nSalam sejahtera bagi kita semua. Kami ingin menginformasikan kepada Anda, orang tua ananda *{nama_siswa}*, untuk tunggakan tagihan anak Anda sebesar *{jumlah_tagihan}*.\n\nDengan Rincian Tagihan: \n\n{rincian}\n\nDemikian pesan dari kami. Wassalam 🙏.\n\n*pesan dari *{nama_sekolah}*.\n\n*silahkan hubungi admin sekolah jika ada kesalahan tagihan atau nama siswa*.",
        "Selamat pagi/siang/malam, Bapak/Ibu. \n\nKami ingin mengingatkan bahwa tunggakan tagihan untuk ananda *{nama_siswa}* sebesar *{jumlah_tagihan}* sudah jatuh tempo.\n\nRincian Tagihan: \n\n{rincian}\n\nTerima kasih atas perhatiannya. Salam hormat dari kami 🙏.\n\n*pesan otomatis dari {nama_sekolah}*\n\n*silahkan hubungi admin sekolah jika ada kesalahan tagihan atau nama siswa*",
        "*Permisi Bapak/Ibu, berikut ini merupakan pesan pengingat untuk tunggakan tagihan sekolah yang dimiliki ananda *{nama_siswa}* yang berjumlah *{jumlah_tagihan}*.\n\nDengan Rincian Tagihannya: \n\n{rincian}\n\nKami harap Bapak/Ibu dapat segera melunasi beban tagihan tersebut. Terima kasih. Wassalamualaikum Wr Wb 🙏.\n\n*silahkan hubungi admin sekolah jika ada kesalahan tagihan atau nama siswa*",
        "Dengan hormat, kami sampaikan kepada Bapak/Ibu, bahwa tunggakan tagihan untuk ananda *{nama_siswa}* sebesar *{jumlah_tagihan}* sudah harus dibayarkan.\n\nRincian Tagihan: \n\n{rincian}\n\nTerima kasih atas perhatian dan kerja samanya. Wassalam 🙏.\n\n*pesan otomatis dari {nama_sekolah}*\n\n*silahkan hubungi admin sekolah jika ada kesalahan tagihan atau nama siswa*",
        "Assalamualaikum Wr Wb,\n\nKami berharap Anda dalam keadaan baik. Kami ingin mengingatkan mengenai tunggakan tagihan ananda *{nama_siswa}* sebesar *{jumlah_tagihan}*. \n\nRincian tagihan dapat Anda lihat di bawah ini: \n\n{rincian}\n\nKami menghargai kerjasama Anda dalam menyelesaikan hal ini.\n\n*Pesan dari *{nama_sekolah}*.\n\n*Silahkan hubungi admin sekolah jika ada kesalahan tagihan atau nama siswa*.",
        "Selamat pagi/siang/malam,\n\nDengan penuh rasa hormat, kami menginformasikan bahwa ananda *{nama_siswa}* memiliki tunggakan tagihan sebesar *{jumlah_tagihan}*. \n\nBerikut adalah rincian tagihan: \n\n{rincian}\n\nKami menghargai perhatian Anda terhadap hal ini.\n\n*Pesan dari *{nama_sekolah}*.\n\n*Silahkan hubungi admin sekolah jika ada kesalahan tagihan atau nama siswa*.",
        "Assalamualaikum,\n\nSalam sejahtera. Kami ingin memberitahukan Anda tentang tunggakan tagihan ananda *{nama_siswa}* yang telah jatuh tempo sebesar *{jumlah_tagihan}*. \n\nRincian tagihan adalah sebagai berikut: \n\n{rincian}\n\nKami berharap Anda dapat segera menindaklanjuti. Terima kasih.\n\n*Pesan dari *{nama_sekolah}*.\n\n*Silahkan hubungi admin sekolah jika ada kesalahan tagihan atau nama siswa*.",
        "Kepada Yth. Bapak/Ibu,\n\nDengan hormat, kami ingin mengingatkan bahwa terdapat tunggakan tagihan untuk ananda *{nama_siswa}* yang totalnya mencapai *{jumlah_tagihan}*. \n\nSilakan lihat rincian tagihan di bawah ini: \n\n{rincian}\n\nTerima kasih atas kerjasama Anda dalam hal ini.\n\n*Pesan dari *{nama_sekolah}*.\n\n*Silahkan hubungi admin sekolah jika ada kesalahan tagihan atau nama siswa*.",
        "Halo Bapak/Ibu,\n\nKami ingin mengingatkan bahwa ananda *{nama_siswa}* memiliki tunggakan tagihan sebesar *{jumlah_tagihan}*. \n\nBerikut rincian tagihan yang perlu Anda ketahui: \n\n{rincian}\n\nKami sangat menghargai perhatian Anda dalam menyelesaikan hal ini.\n\n*Pesan dari *{nama_sekolah}*.\n\n*Silahkan hubungi admin sekolah jika ada kesalahan tagihan atau nama siswa*.",
        "Assalamualaikum Wr Wb,\n\nSalam hormat untuk Anda. Kami ingin menginformasikan tentang tunggakan tagihan untuk ananda *{nama_siswa}* yang sebesar *{jumlah_tagihan}*. \n\nBerikut rincian tagihan: \n\n{rincian}\n\nKami berharap untuk dapat segera menyelesaikan hal ini. Terima kasih.\n\n*Pesan dari *{nama_sekolah}*.\n\n*Silahkan hubungi admin sekolah jika ada kesalahan tagihan atau nama siswa*.",
        "Selamat pagi/siang/sore/malam,\n\nDengan penuh rasa hormat, kami ingin mengingatkan Anda bahwa ananda *{nama_siswa}* memiliki tunggakan tagihan sebesar *{jumlah_tagihan}*. \n\nRincian tagihan adalah sebagai berikut: \n\n{rincian}\n\nKami sangat menghargai perhatian Anda dalam hal ini.\n\n*Pesan dari *{nama_sekolah}*.\n\n*Silahkan hubungi admin sekolah jika ada kesalahan tagihan atau nama siswa*.",
        "Assalamualaikum,\n\nSalam sejahtera bagi kita semua. Kami ingin mengingatkan bahwa tunggakan tagihan untuk ananda *{nama_siswa}* sebesar *{jumlah_tagihan}* sudah jatuh tempo. \n\nBerikut rincian tagihan: \n\n{rincian}\n\nKami berharap Anda dapat menindaklanjuti dalam waktu dekat. Wassalam 🙏.\n\n*Pesan dari *{nama_sekolah}*.\n\n*Silahkan hubungi admin sekolah jika ada kesalahan tagihan atau nama siswa*.",
        "Yth. Bapak/Ibu,\n\nKami ingin mengingatkan bahwa terdapat tunggakan tagihan untuk ananda *{nama_siswa}* sebesar *{jumlah_tagihan}*. \n\nSilakan lihat rincian tagihan di bawah ini: \n\n{rincian}\n\nTerima kasih atas perhatian Anda dalam hal ini. Kami menghargai kerjasama Anda.\n\n*Pesan dari *{nama_sekolah}*.\n\n*Silahkan hubungi admin sekolah jika ada kesalahan tagihan atau nama siswa*.",
        "Assalamualaikum,\n\nDengan hormat, kami ingin memberitahukan bahwa ananda *{nama_siswa}* memiliki tunggakan tagihan sebesar *{jumlah_tagihan}*. \n\nBerikut adalah rincian tagihan: \n\n{rincian}\n\nKami sangat menghargai perhatian dan kerjasama Anda dalam hal ini.\n\n*Pesan dari *{nama_sekolah}*.\n\n*Silahkan hubungi admin sekolah jika ada kesalahan tagihan atau nama siswa*.",
        "Salam hormat,\n\nKami ingin mengingatkan Bapak/Ibu bahwa terdapat tunggakan tagihan untuk ananda *{nama_siswa}* sebesar *{jumlah_tagihan}*. \n\nBerikut adalah rincian tagihan: \n\n{rincian}\n\nKami berterima kasih atas perhatian Anda dalam menyelesaikan hal ini.\n\n*Pesan dari *{nama_sekolah}*.\n\n*Silahkan hubungi admin sekolah jika ada kesalahan tagihan atau nama siswa*.",
        "Assalamualaikum Wr Wb,\n\nKami ingin mengingatkan bahwa tunggakan tagihan untuk ananda *{nama_siswa}* adalah sebesar *{jumlah_tagihan}*. \n\nDengan rincian: \n\n{rincian}\n\nKami menghargai kerjasama Anda dalam menindaklanjuti hal ini. Wassalam 🙏.\n\n*Pesan dari *{nama_sekolah}*.\n\n*Silahkan hubungi admin sekolah jika ada kesalahan tagihan atau nama siswa*.",
        "Selamat pagi/siang/sore/malam,\n\nKami ingin mengingatkan bahwa tunggakan tagihan untuk ananda *{nama_siswa}* sebesar *{jumlah_tagihan}*. \n\nRincian tagihan adalah: \n\n{rincian}\n\nTerima kasih atas perhatian dan kerjasama Anda. Kami berharap dapat segera menyelesaikan hal ini.\n\n*Pesan dari *{nama_sekolah}*.\n\n*Silahkan hubungi admin sekolah jika ada kesalahan tagihan atau nama siswa*."
    ];



    // Fungsi untuk memuat data siswa berdasarkan filter dan pencarian
    const loadSiswa = (searchQuery = '', filterKelas = '', sekolah = '') => {

        loadingSiswa.classList.remove('hidden');

        fetch('../Config/filterSiswaTagihan.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'search_query': searchQuery,
                    'filter_kelas': filterKelas,
                    'sekolah': sekolah,

                })
            })
            .then(response => response.json())
            .then(data => {
                siswaList.innerHTML = data.siswaOptions;
                restoreSelectedSiswa();

                if (data.siswaOptions.trim() === '') {
                    noSiswaMessage.classList.remove('hidden');
                } else {
                    noSiswaMessage.classList.add('hidden');
                }
                loadingSiswa.classList.add('hidden');
                updateSelectedCount();
            })
            .catch(error => {
                console.error('Error:', error);
                loadingSiswa.classList.add('hidden');
            });

    };

    //Event listener untuk perubahan input di kolom pencarian
    // searchSiswaInput.addEventListener('input', () => {
    //     const searchQuery = searchSiswaInput.value.trim();
    //     if (searchQuery === '') {
    //         loadSiswa('', filterKelasSelect.value); // Memuat siswa tanpa pencarian dan berdasarkan filter kelas
    //     } else {
    //         loadSiswa(searchQuery, filterKelasSelect.value);
    //     }
    // });

    // // Event listener untuk perubahan pada filter kelas
    // filterKelasSelect.addEventListener('change', () => {
    //     const searchQuery = searchSiswaInput.value.trim();
    //     loadSiswa(searchQuery, filterKelasSelect.value);
    // });

    // Event listener untuk perubahan input di kolom pencarian
    searchSiswaInput.addEventListener('input', () => {
        const searchQuery = searchSiswaInput.value.trim();
        const filterKelas = filterKelasSelect.value;
        const sekolah = sekolahSelect.value; // Ambil nilai sekolah yang dipilih
        loadSiswa(searchQuery, filterKelas, sekolah); // Muat siswa dengan query pencarian
    });

    // Event listener untuk perubahan pada filter kelas
    filterKelasSelect.addEventListener('change', () => {
        const searchQuery = searchSiswaInput.value.trim();
        const sekolah = sekolahSelect.value; // Ambil nilai sekolah yang dipilih
        loadSiswa(searchQuery, filterKelasSelect.value, sekolah); // Muat siswa berdasarkan filter kelas
    });

    // Event listener untuk perubahan pada pilihan sekolah
    sekolahSelect.addEventListener('change', () => {
        const searchQuery = searchSiswaInput.value.trim();
        const filterKelas = filterKelasSelect.value; // Ambil filter kelas yang dipilih
        loadSiswa(searchQuery, filterKelas, sekolahSelect.value); // Muat siswa berdasarkan sekolah
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


        // Hapus centang pada semua checkbox tagihan jika siswa tidak terpilih
        const allCheckboxes = billingData.querySelectorAll('.tagihan-checkbox');
        allCheckboxes.forEach(checkbox => {
            const siswaId = checkbox.dataset.idSiswa;
            if (!selectedSiswaIds.includes(siswaId)) {
                checkbox.checked = false; // Hapus centang jika siswa tidak terpilih
                delete tagihanCheckedStatus[checkbox.value]; // Hapus dari status yang dicentang
            }
        });

        if (selectedSiswaIds.length === 0) {
            billingData.innerHTML = '<tr><td class="py-2 text-center" colspan="6">Tidak ada tagihan ditemukan!</td></tr>';
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

                        row.innerHTML = `
            <td class="py-2 px-4 border-b border-gray-300">
                <input type="checkbox" value="${idTagihan}" class="tagihan-checkbox bg-transparent peer mr-2 appearance-none h-4 w-4 border-2 rounded-full hover:border-teal-500 cursor-pointer border-teal-300"
                    data-tagihan="${tagihan[columns.tagihan]}" 
                    data-tgl-tagihan="${tagihan[columns.tanggal_tagihan]}"
                    data-nama-siswa="${namaSiswa}"
                    data-id-siswa="${tagihan[columns.id_siswa]}"
                    data-id-tagihan="${idTagihan}"
                    ${isChecked ? 'checked' : ''}> 
            </td>
            <td class="py-2 px-4 border-b border-gray-300">${tagihan[columns.name_tagihan] ? tagihan[columns.name_tagihan] : '-'}</td>
            <td class="py-2 px-4 border-b border-gray-300">${tagihan[columns.tanggal_tagihan]}</td>
            <td class="py-2 px-4 border-b border-gray-300">Rp${Number(tagihan[columns.tagihan]).toLocaleString('id-ID')}</td>
            <td class="py-2 px-4 border-b">${tagihan[columns.tanggal_lunas] ? tagihan[columns.tanggal_lunas] : "<span class='inline-block bg-red-500 text-white px-2 py-1 rounded-full text-xs shadow-md'>Unpaid</span>"}</td>
            <td class="py-2 px-4 border-b">${tagihan[columns.lunas] == 1 ? "<span class='inline-block bg-green-500 text-white px-2 py-1 rounded-full text-xs shadow-md'>L</span>" : "<span class='inline-block bg-red-500 text-white px-2 py-1 rounded-full text-xs shadow-md'>B</span>"}</td>
        `;

                        billingData.appendChild(row);

                        // Save the tagihan data in the tagihanDataMap
                        if (!tagihanDataMap[namaSiswa]) {
                            tagihanDataMap[namaSiswa] = [];
                        }
                        tagihanDataMap[namaSiswa].push({
                            id_tagihan: tagihan[columns.id_tagihan],
                            id_siswa: tagihan[columns.id_siswa],
                            tagihan: tagihan[columns.tagihan],
                            tgl_tagihan: tagihan[columns.tanggal_tagihan],
                        });

                        // Add event listener for each checkbox to update the reminder box
                        row.querySelector('.tagihan-checkbox').addEventListener('change', (e) => {
                            const tagihanId = e.target.dataset.idTagihan;
                            if (e.target.checked) {
                                tagihanCheckedStatus[tagihanId] = true; // Simpan status centang
                            } else {
                                delete tagihanCheckedStatus[tagihanId]; // Hapus status jika tidak dicentang
                            }
                            updateReminderBox(); // Panggil untuk memperbarui reminder
                        });

                    });
                });

                updateReminderBox();

            })
            .catch(error => {
                console.error('Error fetching billing data:', error);
                billingData.innerHTML = '<tr><td colspan="7">Error fetching data</td></tr>';
            });
    };


    const updateReminderBox = () => {
        const selectedTagihan = [];

        // Loop through the checked status of each tagihan and collect the relevant data
        Object.keys(tagihanCheckedStatus).forEach(tagihanId => {
            if (tagihanCheckedStatus[tagihanId]) {
                for (const siswa in tagihanDataMap) {
                    const tagihanList = tagihanDataMap[siswa];
                    const tagihanItem = tagihanList.find(t => t.id_tagihan == tagihanId);

                    if (tagihanItem) {
                        selectedTagihan.push({
                            id_tagihan: tagihanItem.id_tagihan,
                            nama_siswa: siswa,
                            id_siswa: tagihanItem.id_siswa,
                            name_tagihan: tagihanItem.name_tagihan,
                            tagihan: tagihanItem.tagihan,
                            tgl_tagihan: tagihanItem.tgl_tagihan,
                        });
                        break;
                    }
                }
            }
        });

        reminderBox.innerHTML = ''; // Clear previous content

        function getSelectedSchool() {
            const selectElement = document.getElementById('sekolahSiswa');
            const selectedSchool = selectElement.value;
            return selectedSchool;
        }

        // Contoh penggunaan di dalam fungsi updateReminderBox
        const namaSekolah = getSelectedSchool();

        if (selectedTagihan.length === 0) {
            reminderBox.textContent = 'Pesan reminder akan muncul disini';
        } else {
            const groupedTagihan = {};
            const reminderMessages = {};

            // Group selectedTagihan by id_siswa
            selectedTagihan.forEach(tagihan => {
                if (!groupedTagihan[tagihan.id_siswa]) {
                    groupedTagihan[tagihan.id_siswa] = [];
                }
                groupedTagihan[tagihan.id_siswa].push(tagihan);
            });

            const messages = [];

            // Generate reminder messages
            Object.keys(groupedTagihan).forEach(idSiswa => {
                const tagihanList = groupedTagihan[idSiswa];
                const namaSiswa = tagihanList[0].nama_siswa;
                const totalTagihan = tagihanList.reduce((total, t) => total + Number(t.tagihan), 0);
                const rincianTagihan = tagihanList.map(t => `\u00A0\u00A0\u00A0\u00A0*- ${t.name_tagihan || '-'} : Rp${Number(t.tagihan).toLocaleString('id-ID')}*`).join('\n');

                // Select a random template
                const randomTemplate = reminderTemplates[Math.floor(Math.random() * reminderTemplates.length)];

                // Replace placeholders in the template
                const personalizedMessage = randomTemplate
                    .replace('{nama_siswa}', namaSiswa)
                    .replace('{jumlah_tagihan}', `Rp${totalTagihan.toLocaleString('id-ID')}`)
                    .replace('{rincian}', rincianTagihan)
                    .replace('{nama_sekolah}', namaSekolah);

                // Store message in reminderMessages
                if (!reminderMessages[idSiswa]) {
                    reminderMessages[idSiswa] = [];
                }
                reminderMessages[idSiswa].push(personalizedMessage);

                // Add the personalized message to the list
                messages.push(personalizedMessage);
            });

            // Display the messages in the reminder box
            reminderBox.innerHTML = messages.map(msg => `<p>${msg}</p>`).join('<br/>');

            // Update hidden reminder content with JSON string of reminderMessages
            document.getElementById('hiddenReminderContent').value = JSON.stringify(reminderMessages);
        }
    };



    // Event listener untuk memperbarui status tagihanCheckedStatus saat checkbox diubah
    const setupTagihanCheckboxListeners = () => {

        const siswaCheckboxes = document.querySelectorAll('input[type="checkbox"][data-id-siswa]'); // Menyesuaikan selektor

        siswaCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const siswaId = e.target.dataset.idSiswa; // Ambil ID siswa dari atribut data

                if (!e.target.checked) {
                    // Jika siswa tidak dicentang, hapus centang semua checkbox tagihan mereka
                    const allCheckboxes = billingData.querySelectorAll('.tagihan-checkbox');
                    allCheckboxes.forEach(tagihanCheckbox => {
                        if (tagihanCheckbox.dataset.idSiswa === siswaId) {
                            tagihanCheckbox.checked = false;
                            delete tagihanCheckedStatus[tagihanCheckbox.value]; // Perbarui status yang dicentang
                        }
                    });
                }
                updateReminderBox(); // Perbarui kotak pengingat
            });
        });

        const allCheckboxes = document.querySelectorAll('.tagihan-checkbox');


        allCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const tagihanId = e.target.getAttribute('data-id-tagihan');
                tagihanCheckedStatus[tagihanId] = e.target.checked;
                updateReminderBox(); // Panggil fungsi update saat checkbox diubah
            });
        });
    };

    // Panggil setup saat DOM siap
    document.addEventListener('DOMContentLoaded', () => {
        setupTagihanCheckboxListeners();
    });



    siswaList.addEventListener('change', (event) => {
        if (event.target.type === 'checkbox') {
            const siswaId = event.target.value;
            if (event.target.checked) {
                if (!selectedSiswa.includes(siswaId)) {
                    selectedSiswa.push(siswaId);
                }
            } else {
                // const index = selectedSiswa.indexOf(siswaId);
                // if (index > -1) {
                //     selectedSiswa.splice(index, 1);
                // }
                selectedSiswa = selectedSiswa.filter(id => id !== siswaId);
            }
            updateSelectedCount();
            loadBillingData();
        }
    });

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



document.addEventListener('DOMContentLoaded', function() {
    const messageField = document.getElementById('messageField');
    const reminderBoxField = document.getElementById('reminderBoxField');
    const reminderBox = document.getElementById('reminderbox');
    const hiddenReminderContent = document.getElementById('hiddenReminderContent');

    // Function to copy reminder box content to hidden input
    function copyReminderBoxContent() {
        hiddenReminderContent.value = reminderBox.innerHTML;

    }


});