// document.addEventListener('DOMContentLoaded', () => {
//     const searchSiswaInput = document.getElementById('search-siswa');
//     const filterKelasSelect = document.getElementById('filter-kelas');
//     const siswaList = document.getElementById('siswa-list');
//     const noSiswaMessage = document.getElementById('no-siswa-message');
//     const selectedCount = document.getElementById('selected-count');
//     const billingTable = document.getElementById('tagihanTable');
//     const billingData = document.getElementById('dataTagihan');
//     const reminderBox = document.getElementById('reminderbox');
//     const loadingSiswa = document.getElementById('loading-siswa');

//     let selectedSiswa = [];
//     let columns = {};
//     let tagihanCheckedStatus = {};
//     let tagihanDataMap = {};
//     let selectedSiswaMap = {};
//     let selectedTagihanOrder = [];


//     const reminderTemplates = [
//         "Kepada Yth. {nama_siswa}, mohon segera melunasi tagihan sebesar Rp{tagihan} yang jatuh tempo pada {tgl_tagihan}.",
//         "Perhatian {nama_siswa}, tagihan Anda sebesar Rp{tagihan} untuk tanggal {tgl_tagihan} sudah memasuki jatuh tempo.",
//         "Diberitahukan kepada {nama_siswa}, bahwa tagihan senilai Rp{tagihan} per tanggal {tgl_tagihan} menunggu pembayaran Anda.",
//         "Yth. {nama_siswa}, kami mengingatkan bahwa terdapat tagihan sebesar Rp{tagihan} yang perlu dilunasi sebelum {tgl_tagihan}.",
//         "Kepada {nama_siswa}, mohon perhatian Anda untuk tagihan Rp{tagihan} yang jatuh tempo {tgl_tagihan}.",
//         "Salam, {nama_siswa}. Kami informasikan adanya tagihan Rp{tagihan} yang perlu diselesaikan sebelum {tgl_tagihan}.",
//         "Pemberitahuan untuk {nama_siswa}: Tagihan Anda sebesar Rp{tagihan} jatuh tempo pada {tgl_tagihan}. Mohon segera dilunasi.",
//         "{nama_siswa} yang terhormat, tagihan Rp{tagihan} untuk periode {tgl_tagihan} memerlukan perhatian Anda.",
//         "Mohon perhatian {nama_siswa}, tagihan Anda Rp{tagihan} yang jatuh tempo {tgl_tagihan} menunggu pembayaran.",
//         "Kepada {nama_siswa}, kami ingatkan tentang tagihan Rp{tagihan} yang perlu dilunasi sebelum {tgl_tagihan}.",
//         "Yth. {nama_siswa}, mohon segera selesaikan pembayaran tagihan Rp{tagihan} yang jatuh tempo {tgl_tagihan}.",
//         "Perhatian {nama_siswa}, tagihan Anda Rp{tagihan} untuk {tgl_tagihan} memerlukan tindak lanjut pembayaran.",
//         "{nama_siswa}, kami informasikan adanya tagihan sebesar Rp{tagihan} yang jatuh tempo pada {tgl_tagihan}.",
//         "Kepada {nama_siswa}, mohon segera lunasi tagihan Rp{tagihan} yang telah jatuh tempo sejak {tgl_tagihan}.",
//         "Yth. {nama_siswa}, tagihan Anda Rp{tagihan} untuk periode {tgl_tagihan} menunggu pembayaran Anda.",
//         "Pemberitahuan untuk {nama_siswa}: Tagihan senilai Rp{tagihan} jatuh tempo {tgl_tagihan}. Mohon segera diselesaikan.",
//         "{nama_siswa} yang terhormat, kami ingatkan tentang tagihan Rp{tagihan} yang perlu dilunasi sebelum {tgl_tagihan}.",
//         "Salam, {nama_siswa}. Mohon perhatikan tagihan Anda sebesar Rp{tagihan} yang jatuh tempo pada {tgl_tagihan}.",
//         "Kepada {nama_siswa}, tagihan Anda Rp{tagihan} untuk periode {tgl_tagihan} memerlukan pembayaran segera.",
//         "Yth. {nama_siswa}, mohon segera selesaikan tagihan Rp{tagihan} yang jatuh tempo {tgl_tagihan}.",
//         "Perhatian {nama_siswa}, terdapat tagihan sebesar Rp{tagihan} yang perlu dilunasi sebelum {tgl_tagihan}.",
//         "{nama_siswa}, kami mengingatkan adanya tagihan Rp{tagihan} yang jatuh tempo pada {tgl_tagihan}.",
//         "Kepada {nama_siswa}, mohon segera lunasi tagihan Anda sebesar Rp{tagihan} untuk periode {tgl_tagihan}.",
//         "Yth. {nama_siswa}, tagihan Anda Rp{tagihan} yang jatuh tempo {tgl_tagihan} menunggu pembayaran.",
//         "Pemberitahuan untuk {nama_siswa}: Tagihan Rp{tagihan} jatuh tempo {tgl_tagihan}. Mohon segera diselesaikan.",
//         "{nama_siswa} yang terhormat, kami ingatkan tentang tagihan Rp{tagihan} yang perlu dilunasi sebelum {tgl_tagihan}.",
//         "Salam, {nama_siswa}. Mohon perhatikan tagihan Anda Rp{tagihan} yang jatuh tempo pada {tgl_tagihan}.",
//         "Kepada {nama_siswa}, tagihan senilai Rp{tagihan} untuk periode {tgl_tagihan} memerlukan pembayaran segera.",
//         "Yth. {nama_siswa}, mohon segera selesaikan pembayaran tagihan Rp{tagihan} yang jatuh tempo {tgl_tagihan}.",
//         "Perhatian {nama_siswa}, terdapat tagihan Rp{tagihan} yang perlu dilunasi sebelum tanggal {tgl_tagihan}."
//     ];


//     // Fungsi untuk memuat data siswa berdasarkan filter dan pencarian
//     const loadSiswa = (searchQuery = '', filterKelas = '') => {

//         loadingSiswa.classList.remove('hidden');

//         fetch('../Config/filterSiswa.php', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded',
//                 },
//                 body: new URLSearchParams({
//                     'search_query': searchQuery,
//                     'filter_kelas': filterKelas
//                 })
//             })
//             .then(response => response.text())
//             .then(data => {
//                 siswaList.innerHTML = data;
//                 restoreSelectedSiswa();

//                 if (siswaList.children.length === 0) {
//                     noSiswaMessage.classList.remove('hidden');
//                 } else {
//                     noSiswaMessage.classList.add('hidden');
//                 }
//                 loadingSiswa.classList.add('hidden');
//                 updateSelectedCount();
//             })
//             .catch(error => {
//                 console.error('Error:', error);
//                 loadingSiswa.classList.add('hidden');
//             });

//     };

//     // Event listener untuk perubahan input di kolom pencarian
//     searchSiswaInput.addEventListener('input', () => {
//         const searchQuery = searchSiswaInput.value.trim();
//         if (searchQuery === '') {
//             loadSiswa('', filterKelasSelect.value); // Memuat siswa tanpa pencarian dan berdasarkan filter kelas
//         } else {
//             loadSiswa(searchQuery, filterKelasSelect.value);
//         }
//     });

//     // Event listener untuk perubahan pada filter kelas
//     filterKelasSelect.addEventListener('change', () => {
//         const searchQuery = searchSiswaInput.value.trim();
//         loadSiswa(searchQuery, filterKelasSelect.value);
//     });

//     const updateSelectedSiswa = () => {
//         // Ambil semua checkbox siswa yang diceklis
//         const checkboxes = Array.from(siswaList.querySelectorAll('input[type="checkbox"]:checked'));

//         // Log untuk memeriksa apakah checkbox yang diceklis terambil dengan benar
//         console.log('Checkbox yang diceklis:', checkboxes);

//         // Ambil nilai (id_siswa) dari checkbox yang diceklis
//         selectedSiswa = checkboxes.map(checkbox => checkbox.value);
//         console.log('ID siswa yang dipilih:', selectedSiswa); // Log untuk memeriksa ID siswa yang dipilih

//         // Buat objek selectedSiswaMap yang berisi id_siswa sebagai kunci dan nama_siswa sebagai nilai
//         selectedSiswaMap = {};
//         selectedSiswa.forEach(siswaId => {
//             // Cari checkbox yang sesuai dengan siswaId dan ambil data-nama (nama siswa)
//             const siswaCheckbox = siswaList.querySelector(`input[value="${siswaId}"]`);
//             if (siswaCheckbox) {
//                 const siswaName = siswaCheckbox.getAttribute('data-nama');
//                 selectedSiswaMap[siswaId] = siswaName;
//             } else {
//                 console.warn(`Checkbox dengan siswaId ${siswaId} tidak ditemukan.`);
//             }
//         });

//         // Log untuk melihat hasil akhir selectedSiswaMap
//         console.log('selectedSiswaMap yang diperbarui:', selectedSiswaMap);
//     };


//     const restoreSelectedSiswa = () => {
//         const checkboxes = siswaList.querySelectorAll('input[type="checkbox"]');
//         checkboxes.forEach(checkbox => {
//             checkbox.checked = selectedSiswa.includes(checkbox.value);
//         });
//     };

//     const updateSelectedCount = () => {
//         const checkedBoxes = siswaList.querySelectorAll('input[type="checkbox"]:checked');
//         selectedCount.textContent = checkedBoxes.length;
//     };

    
//     const loadBillingData = () => {
//         const selectedSiswaIds = Array.from(siswaList.querySelectorAll('input[type="checkbox"]:checked'))
//             .map(checkbox => checkbox.value);

//         if (selectedSiswaIds.length === 0) {
//             billingData.innerHTML = '<tr><td class="py-2 text-center" colspan="5">Tidak ada tagihan ditemukan!</td></tr>';
//             reminderBox.textContent = 'Pesan reminder akan muncul disini';
//             // Clear all checkboxes status
//             tagihanCheckedStatus = {};
//             updateReminderBox();
//             return;
//         }

//         const loadingAnimation = `...`; // your existing SVG loading animation

//         billingData.innerHTML = loadingAnimation;

//         fetch('../Config/fetchTagihan.php', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded',
//                 },
//                 body: new URLSearchParams({
//                     'selected_siswa': JSON.stringify(selectedSiswaIds)
//                 })
//             })
//             .then(response => response.json())
//             .then(responseData => {
//                 columns = responseData.columns;
//                 const data = responseData.data;

//                 billingData.innerHTML = '';
//                 tagihanDataMap = {};

//                 if (data.length === 0) {
//                     billingData.innerHTML = '<tr><td class="py-2 text-center" colspan="5">Tidak ada tagihan ditemukan.</td></tr>';
//                     reminderBox.textContent = 'Pesan reminder akan muncul disini';
//                     return;
//                 }

//                 // Group data by siswa
//                 const groupedData = data.reduce((acc, tagihan) => {
//                     const namaSiswa = tagihan[columns.nama_siswa];
//                     if (!acc[namaSiswa]) {
//                         acc[namaSiswa] = [];
//                     }
//                     acc[namaSiswa].push(tagihan);
//                     return acc;
//                 }, {});

//                 // Remove unchecked siswa's tagihan from tagihanCheckedStatus
//                 const siswaTagihanIds = [];
//                 Object.keys(groupedData).forEach(namaSiswa => {
//                     groupedData[namaSiswa].forEach(tagihan => {
//                         const idSiswaTagihan = tagihan[columns.id_siswa_tagihan];
//                         siswaTagihanIds.push(idSiswaTagihan);
//                     });
//                 });

//                 // Remove status for unchecked siswa tagihan
//                 Object.keys(tagihanCheckedStatus).forEach(idTagihan => {
//                     if (!siswaTagihanIds.includes(idTagihan)) {
//                         delete tagihanCheckedStatus[idTagihan];
//                     }
//                 });

//                 // Render table rows for each siswa and their tagihan
//                 Object.keys(groupedData).forEach(namaSiswa => {
//                     // Add row for siswa name
//                     const siswaRow = document.createElement('tr');
//                     siswaRow.innerHTML = `<td class="py-2 px-4 border-b border-gray-300" colspan="5">${namaSiswa}</td>`;
//                     billingData.appendChild(siswaRow);

//                     // Add rows for tagihan
//                     groupedData[namaSiswa].forEach(tagihan => {
//                         const idSiswaTagihan = tagihan[columns.id_siswa_tagihan];
//                         const row = document.createElement('tr');
//                         const isChecked = tagihanCheckedStatus[idSiswaTagihan] || false;

//                         row.innerHTML = `
//                 <td class="py-2 px-4 border-b border-gray-300">
//                     <input type="checkbox" value="${idSiswaTagihan}" class="tagihan-checkbox bg-transparent peer mr-2 appearance-none h-4 w-4 border-2 rounded-full hover:border-teal-500 cursor-pointer border-teal-300"
//                         data-tagihan="${tagihan[columns.tagihan]}" 
//                         data-tgl-tagihan="${tagihan[columns.tanggal_tagihan]}"
//                         data-nama-siswa="${namaSiswa}"
//                         data-id-siswa="${tagihan[columns.id_siswa]}"
//                         data-id-siswa-tagihan="${idSiswaTagihan}"
//                         data-id-tagihan="${tagihan[columns.id_tagihan]}"
//                         ${isChecked ? 'checked' : ''}>
//                 </td>
//                 <td class="py-2 px-4 border-b border-gray-300">${tagihan[columns.name_tagihan] ? tagihan[columns.name_tagihan] : '-'}</td>
//                 <td class="py-2 px-4 border-b border-gray-300">${tagihan[columns.tanggal_tagihan]}</td>
//                 <td class="py-2 px-4 border-b border-gray-300">Rp${tagihan[columns.tagihan]}</td>
//             `;

//                         billingData.appendChild(row);

//                         // Save the tagihan data in the tagihanDataMap
//                         if (!tagihanDataMap[namaSiswa]) {
//                             tagihanDataMap[namaSiswa] = [];
//                         }
//                         tagihanDataMap[namaSiswa].push({
//                             id_tagihan: tagihan[columns.id_tagihan],
//                             id_siswa: tagihan[columns.id_siswa],
//                             id_siswa_tagihan: idSiswaTagihan,
//                             tagihan: tagihan[columns.tagihan],
//                             tgl_tagihan: tagihan[columns.tanggal_tagihan],
//                         });

//                         // Add event listener for each checkbox to update the reminder box
//                         row.querySelector('.tagihan-checkbox').addEventListener('change', (e) => {
//                             const tagihanId = e.target.dataset.idSiswaTagihan;
//                             if (e.target.checked) {
//                                 tagihanCheckedStatus[tagihanId] = true;
//                             } else {
//                                 delete tagihanCheckedStatus[tagihanId];
//                             }
//                             updateReminderBox();
//                         });
//                     });
//                 });

//                 updateReminderBox();

//             })
//             .catch(error => {
//                 console.error('Error fetching billing data:', error);
//                 billingData.innerHTML = '<tr><td colspan="7">Error fetching data</td></tr>';
//             });
//     };

//     //PAKE YG INI
//     const updateReminderBox = () => {
//         const selectedTagihan = [];

//         Object.keys(tagihanCheckedStatus).forEach(tagihanId => {
//             if (tagihanCheckedStatus[tagihanId]) {
//                 for (const siswa in tagihanDataMap) {
//                     const tagihanList = tagihanDataMap[siswa];
//                     const tagihanItem = tagihanList.find(t => t.id_siswa_tagihan == tagihanId);

//                     if (tagihanItem) {
//                         selectedTagihan.push({
//                             id_siswa_tagihan: tagihanItem.id_siswa_tagihan,
//                             nama_siswa: siswa,
//                             tagihan: tagihanItem.tagihan,
//                             tgl_tagihan: tagihanItem.tgl_tagihan,
//                         });
//                     }
//                 }
//             }
//         });

//         reminderBox.innerHTML = '';

//         if (selectedTagihan.length === 0) {
//             reminderBox.textContent = 'Pesan reminder akan muncul di sini';
//         } else {
//             const messages = selectedTagihan.map(item => {
//                 const randomTemplate = reminderTemplates[Math.floor(Math.random() * reminderTemplates.length)];
//                 return randomTemplate
//                     .replace('{nama_siswa}', item.nama_siswa)
//                     .replace('{tagihan}', item.tagihan)
//                     .replace('{tgl_tagihan}', item.tgl_tagihan);
//             });

//             const combinedMessages = messages.join('<br>');

//             reminderBox.innerHTML = combinedMessages;
//         }

//         document.getElementById('hiddenReminderContent').value = reminderBox.innerHTML;
//     };


//     // // Event listener untuk memperbarui status tagihanCheckedStatus saat checkbox diubah
//     const setupTagihanCheckboxListeners = () => {
//         const allCheckboxes = document.querySelectorAll('.tagihan-checkbox');

//         allCheckboxes.forEach(checkbox => {
//             checkbox.addEventListener('change', (e) => {
//                 const tagihanId = e.target.getAttribute('data-id-tagihan');
//                 tagihanCheckedStatus[tagihanId] = e.target.checked;
//                 updateReminderBox(); // Panggil fungsi update saat checkbox diubah
//             });
//         });
//     };

//     // Panggil setup saat DOM siap
//     document.addEventListener('DOMContentLoaded', () => {
//         setupTagihanCheckboxListeners();
//     });


//     siswaList.addEventListener('change', (event) => {
//         if (event.target.type === 'checkbox') {
//             const siswaId = event.target.value;
//             if (event.target.checked) {
//                 if (!selectedSiswa.includes(siswaId)) {
//                     selectedSiswa.push(siswaId);
//                 }
//             } else {
//                 // const index = selectedSiswa.indexOf(siswaId);
//                 // if (index > -1) {
//                 //     selectedSiswa.splice(index, 1);
//                 // }
//                 selectedSiswa = selectedSiswa.filter(id => id !== siswaId);
//             }
//             updateSelectedCount();
//             loadBillingData();
//         }
//     });

//     searchSiswaInput.addEventListener('keydown', (event) => {
//         if (event.key === 'Enter') {
//             event.preventDefault();
//         }
//     });

//     filterKelasSelect.addEventListener('keydown', (event) => {
//         if (event.key === 'Enter') {
//             event.preventDefault();
//         }
//     });


//     loadSiswa();
// });



// document.addEventListener('DOMContentLoaded', function() {
//     const messageField = document.getElementById('messageField');
//     const reminderBoxField = document.getElementById('reminderBoxField');
//     const reminderBox = document.getElementById('reminderbox');
//     const hiddenReminderContent = document.getElementById('hiddenReminderContent');

//     // Function to copy reminder box content to hidden input
//     function copyReminderBoxContent() {
//         hiddenReminderContent.value = reminderBox.innerHTML;

//     }

//     // Listen for changes in the radio buttons
//     document.querySelectorAll('input[name="option"]').forEach(function(radio) {
//         radio.addEventListener('change', function() {
//             const selectedOption = this.value;

//             // Hide both fields
//             messageField.classList.add('hidden');
//             reminderBoxField.classList.add('hidden');

//             // Show the appropriate field based on the selected option
//             if (selectedOption === 'message') {
//                 messageField.classList.remove('hidden');
//                 // Ensure hidden input is empty when switching to message
//                 hiddenReminderContent.value = '';
//             } else if (selectedOption === 'reminderbox') {
//                 reminderBoxField.classList.remove('hidden');
//                 // Copy reminder box content to hidden input when switching to reminderbox
//                 copyReminderBoxContent();
//             }
//         });
//     });

//     // By default, show the messageField
//     messageField.classList.remove('hidden');
//     reminderBoxField.classList.add('hidden');
// });



document.addEventListener('DOMContentLoaded', () => {
    const searchSiswaInput = document.getElementById('search-siswa');
    const filterKelasSelect = document.getElementById('filter-kelas');
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
        "Kepada Yth. {nama_siswa}, mohon segera melunasi tagihan sebesar Rp{tagihan} yang jatuh tempo pada {tgl_tagihan}.",
        "Perhatian {nama_siswa}, tagihan Anda sebesar Rp{tagihan} untuk tanggal {tgl_tagihan} sudah memasuki jatuh tempo.",
        "Diberitahukan kepada {nama_siswa}, bahwa tagihan senilai Rp{tagihan} per tanggal {tgl_tagihan} menunggu pembayaran Anda.",
        "Yth. {nama_siswa}, kami mengingatkan bahwa terdapat tagihan sebesar Rp{tagihan} yang perlu dilunasi sebelum {tgl_tagihan}.",
        "Kepada {nama_siswa}, mohon perhatian Anda untuk tagihan Rp{tagihan} yang jatuh tempo {tgl_tagihan}.",
        "Salam, {nama_siswa}. Kami informasikan adanya tagihan Rp{tagihan} yang perlu diselesaikan sebelum {tgl_tagihan}.",
        "Pemberitahuan untuk {nama_siswa}: Tagihan Anda sebesar Rp{tagihan} jatuh tempo pada {tgl_tagihan}. Mohon segera dilunasi.",
        "{nama_siswa} yang terhormat, tagihan Rp{tagihan} untuk periode {tgl_tagihan} memerlukan perhatian Anda.",
        "Mohon perhatian {nama_siswa}, tagihan Anda Rp{tagihan} yang jatuh tempo {tgl_tagihan} menunggu pembayaran.",
        "Kepada {nama_siswa}, kami ingatkan tentang tagihan Rp{tagihan} yang perlu dilunasi sebelum {tgl_tagihan}.",
        "Yth. {nama_siswa}, mohon segera selesaikan pembayaran tagihan Rp{tagihan} yang jatuh tempo {tgl_tagihan}.",
        "Perhatian {nama_siswa}, tagihan Anda Rp{tagihan} untuk {tgl_tagihan} memerlukan tindak lanjut pembayaran.",
        "{nama_siswa}, kami informasikan adanya tagihan sebesar Rp{tagihan} yang jatuh tempo pada {tgl_tagihan}.",
        "Kepada {nama_siswa}, mohon segera lunasi tagihan Rp{tagihan} yang telah jatuh tempo sejak {tgl_tagihan}.",
        "Yth. {nama_siswa}, tagihan Anda Rp{tagihan} untuk periode {tgl_tagihan} menunggu pembayaran Anda.",
        "Pemberitahuan untuk {nama_siswa}: Tagihan senilai Rp{tagihan} jatuh tempo {tgl_tagihan}. Mohon segera diselesaikan.",
        "{nama_siswa} yang terhormat, kami ingatkan tentang tagihan Rp{tagihan} yang perlu dilunasi sebelum {tgl_tagihan}.",
        "Salam, {nama_siswa}. Mohon perhatikan tagihan Anda sebesar Rp{tagihan} yang jatuh tempo pada {tgl_tagihan}.",
        "Kepada {nama_siswa}, tagihan Anda Rp{tagihan} untuk periode {tgl_tagihan} memerlukan pembayaran segera.",
        "Yth. {nama_siswa}, mohon segera selesaikan tagihan Rp{tagihan} yang jatuh tempo {tgl_tagihan}.",
        "Perhatian {nama_siswa}, terdapat tagihan sebesar Rp{tagihan} yang perlu dilunasi sebelum {tgl_tagihan}.",
        "{nama_siswa}, kami mengingatkan adanya tagihan Rp{tagihan} yang jatuh tempo pada {tgl_tagihan}.",
        "Kepada {nama_siswa}, mohon segera lunasi tagihan Anda sebesar Rp{tagihan} untuk periode {tgl_tagihan}.",
        "Yth. {nama_siswa}, tagihan Anda Rp{tagihan} yang jatuh tempo {tgl_tagihan} menunggu pembayaran.",
        "Pemberitahuan untuk {nama_siswa}: Tagihan Rp{tagihan} jatuh tempo {tgl_tagihan}. Mohon segera diselesaikan.",
        "{nama_siswa} yang terhormat, kami ingatkan tentang tagihan Rp{tagihan} yang perlu dilunasi sebelum {tgl_tagihan}.",
        "Salam, {nama_siswa}. Mohon perhatikan tagihan Anda Rp{tagihan} yang jatuh tempo pada {tgl_tagihan}.",
        "Kepada {nama_siswa}, tagihan senilai Rp{tagihan} untuk periode {tgl_tagihan} memerlukan pembayaran segera.",
        "Yth. {nama_siswa}, mohon segera selesaikan pembayaran tagihan Rp{tagihan} yang jatuh tempo {tgl_tagihan}.",
        "Perhatian {nama_siswa}, terdapat tagihan Rp{tagihan} yang perlu dilunasi sebelum tanggal {tgl_tagihan}."
    ];


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
                console.error('Error:', error);
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
        console.log('Checkbox yang diceklis:', checkboxes);

        // Ambil nilai (id_siswa) dari checkbox yang diceklis
        selectedSiswa = checkboxes.map(checkbox => checkbox.value);
        console.log('ID siswa yang dipilih:', selectedSiswa); // Log untuk memeriksa ID siswa yang dipilih

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
        console.log('selectedSiswaMap yang diperbarui:', selectedSiswaMap);
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
                    siswaRow.innerHTML = `<td class="py-2 px-4 font-semibold border-b border-gray-700" colspan="5">${namaSiswa}</td>`;
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
            <td class="py-2 px-4 border-b border-gray-300">Rp${tagihan[columns.tagihan]}</td>
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
                // Loop over each siswa in the data map
                for (const siswa in tagihanDataMap) {
                    const tagihanList = tagihanDataMap[siswa];
                    // Find the tagihan matching the current tagihanId
                    const tagihanItem = tagihanList.find(t => t.id_tagihan == tagihanId);

                    if (tagihanItem) {
                        selectedTagihan.push({
                            id_tagihan: tagihanItem.id_tagihan,
                            nama_siswa: siswa,
                            tagihan: tagihanItem.tagihan,
                            tgl_tagihan: tagihanItem.tgl_tagihan,
                        });
                    }
                }
            }
        });

        reminderBox.innerHTML = ''; // Clear previous content

        if (selectedTagihan.length === 0) {
            reminderBox.textContent = 'Pesan reminder akan muncul disini';
        } else {
            const messages = selectedTagihan.map(tagihan => {
                const randomTemplate = reminderTemplates[Math.floor(Math.random() * reminderTemplates.length)];
                return randomTemplate
                    .replace('{nama_siswa}', tagihan.nama_siswa)
                    .replace('{tagihan}', tagihan.tagihan)
                    .replace('{tgl_tagihan}', tagihan.tgl_tagihan);
            });

            // Gabungkan semua pesan dengan <br> agar terlihat terpisah
            const combinedMessages = messages.join('<br>');

            reminderBox.innerHTML = combinedMessages;
        }

        // Update hidden reminder content
        document.getElementById('hiddenReminderContent').value = reminderBox.innerHTML;
    };




    // Event listener untuk memperbarui status tagihanCheckedStatus saat checkbox diubah
    const setupTagihanCheckboxListeners = () => {
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