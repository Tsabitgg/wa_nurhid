


document.addEventListener('DOMContentLoaded', function() {
    const billingDataAngkatan = document.getElementById('dataTagihan');
    const noDataMessage = document.getElementById('noDataMessage');
    const reminderBoxAngkatan = document.getElementById('reminderbox');
    const methodSelect = document.getElementById('method');
    let reminderMessages = {};
    const reminderTemplates = [
        "Kepada Yth. *{nama_siswa}*, mohon segera melunasi tagihan *{nama_tagihan}* sebesar *{tagihan}* yang jatuh tempo pada *{tgl_tagihan}*.",
        "Perhatian *{nama_siswa}*, tagihan *{nama_tagihan}* Anda sebesar *{tagihan}* untuk periode *{tgl_tagihan}* sudah memasuki jatuh tempo.",
        "Diberitahukan kepada *{nama_siswa}*, bahwa tagihan *{nama_tagihan}* senilai *{tagihan}* per tanggal *{tgl_tagihan}* menunggu pembayaran Anda.",
        "Yth. *{nama_siswa}*, kami mengingatkan bahwa terdapat tagihan *{nama_tagihan}* sebesar *{tagihan}* yang perlu dilunasi sebelum *{tgl_tagihan}*.",
        "Kepada *{nama_siswa}*, mohon perhatian Anda untuk tagihan *{nama_tagihan}* senilai *{tagihan}* yang jatuh tempo pada *{tgl_tagihan}*.",
        "Salam, *{nama_siswa}*. Kami informasikan bahwa tagihan *{nama_tagihan}* sebesar *{tagihan}* perlu diselesaikan sebelum *{tgl_tagihan}*.",
        "Pemberitahuan untuk *{nama_siswa}*: Tagihan *{nama_tagihan}* Anda sebesar *{tagihan}* jatuh tempo pada *{tgl_tagihan}*. Mohon segera dilunasi.",
        "*{nama_siswa}*, yang terhormat, tagihan *{nama_tagihan}* sebesar *{tagihan}* untuk periode *{tgl_tagihan}* memerlukan perhatian Anda.",
        "Mohon perhatian *{nama_siswa}*, tagihan *{nama_tagihan}* Anda sebesar *{tagihan}* yang jatuh tempo pada *{tgl_tagihan}* menunggu pembayaran.",
        "Kepada *{nama_siswa}*, kami ingatkan tentang tagihan *{nama_tagihan}* senilai *{tagihan}* yang perlu dilunasi sebelum *{tgl_tagihan}*.",
        "Yth. *{nama_siswa}*, tagihan *{nama_tagihan}* Anda sebesar *{tagihan}* untuk tanggal *{tgl_tagihan}* harus segera dilunasi.",
        "Perhatian *{nama_siswa}*, terdapat tagihan *{nama_tagihan}* sebesar *{tagihan}* yang jatuh tempo pada *{tgl_tagihan}*. Segera lunasi.",
        "Kepada *{nama_siswa}*, mohon segera menyelesaikan pembayaran tagihan *{nama_tagihan}* sebesar *{tagihan}* yang jatuh tempo pada *{tgl_tagihan}*.",
        "*{nama_siswa}*, kami mengingatkan bahwa tagihan *{nama_tagihan}* Anda senilai *{tagihan}* harus dilunasi sebelum *{tgl_tagihan}*.",
        "Yth. *{nama_siswa}*, mohon perhatikan tagihan *{nama_tagihan}* sebesar *{tagihan}* yang perlu dibayar sebelum *{tgl_tagihan}*.",
        "Diberitahukan kepada *{nama_siswa}*, tagihan *{nama_tagihan}* Anda sebesar *{tagihan}* jatuh tempo pada *{tgl_tagihan}*. Segera lunasi.",
        "Kepada Yth. *{nama_siswa}*, kami ingin mengingatkan bahwa tagihan *{nama_tagihan}* sebesar *{tagihan}* perlu dibayar sebelum *{tgl_tagihan}*.",
        "Perhatian *{nama_siswa}*, tagihan *{nama_tagihan}* sebesar *{tagihan}* menunggu pembayaran Anda sebelum *{tgl_tagihan}*.",
        "Yth. *{nama_siswa}*, segera lunasi tagihan *{nama_tagihan}* Anda senilai *{tagihan}* yang jatuh tempo pada *{tgl_tagihan}*.",
        "Salam hormat, *{nama_siswa}*. Mohon segera lunasi tagihan *{nama_tagihan}* sebesar *{tagihan}* sebelum *{tgl_tagihan}*.",
        "*{nama_siswa}*, tagihan *{nama_tagihan}* Anda senilai *{tagihan}* harus dilunasi sebelum tanggal *{tgl_tagihan}*.",
        "Kepada *{nama_siswa}*, tagihan *{nama_tagihan}* yang sebesar *{tagihan}* jatuh tempo pada *{tgl_tagihan}*. Mohon diperhatikan.",
        "Perhatian untuk *{nama_siswa}*: tagihan *{nama_tagihan}* Anda sebesar *{tagihan}* harus segera dibayar sebelum *{tgl_tagihan}*.",
        "Kepada Yth. *{nama_siswa}*, mohon segera lunasi tagihan *{nama_tagihan}* sebesar *{tagihan}* yang harus dibayar sebelum *{tgl_tagihan}*.",
        "Yth. *{nama_siswa}*, kami mengingatkan Anda mengenai tagihan *{nama_tagihan}* senilai *{tagihan}* yang akan jatuh tempo pada *{tgl_tagihan}*.",
        "Diberitahukan kepada *{nama_siswa}*, tagihan *{nama_tagihan}* sebesar *{tagihan}* perlu dilunasi sebelum *{tgl_tagihan}*.",
        "Salam, *{nama_siswa}*. Tagihan *{nama_tagihan}* Anda sebesar *{tagihan}* jatuh tempo pada *{tgl_tagihan}*. Mohon perhatikan."
    ];

    document.getElementById('angkatan').addEventListener('change', function() {
        const angkatan = this.value;
        billingDataAngkatan.innerHTML = '';
        noDataMessage.style.display = 'none';
        reminderBoxAngkatan.textContent = '';

            // Reset reminderMessages
        reminderMessages = {};

        if (angkatan) {
            const loadingAngkatan = `<tr>
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

            billingDataAngkatan.innerHTML = loadingAngkatan;

            fetch('../Config/fetchTagihanAngkatan.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ 'angkatan': angkatan })
            })
            .then(response => response.json())
            .then(data => {
                billingDataAngkatan.innerHTML = '';
                noDataMessage.style.display = 'none';
                reminderBoxAngkatan.textContent = '';

                if (data.error) {
                    alert(data.error);
                } else if (data.length === 0) {
                    noDataMessage.style.display = 'block';
                } else {
                    const groupedData = groupDataByStudent(data);
                    displayGroupedData(groupedData);
                }
            })
            .catch(error => {
                billingDataAngkatan.innerHTML = '';
                noDataMessage.style.display = 'block';
                console.error('Error:', error);
            });
        } else {
            noDataMessage.style.display = 'block';
        }
    });

    function groupDataByStudent(data) {
        const grouped = {};
        data.forEach(item => {
            if (!grouped[item.id_siswa]) {
                grouped[item.id_siswa] = {
                    nama_siswa: item.nama_siswa,
                    tagihan: []
                };
            }
            grouped[item.id_siswa].tagihan.push(item);
        });
        return grouped;
    }

    function displayGroupedData(groupedData) {
        Object.values(groupedData).forEach(student => {
            const studentRow = `
                <tr>
                    <td colspan="6" class="py-2 px-4 font-bold bg-gray-100">${student.nama_siswa}</td>
                </tr>`;
            billingDataAngkatan.insertAdjacentHTML('beforeend', studentRow);

            student.tagihan.forEach(item => {
                const row = `
                <tr>
                    <td class="py-2 px-4 border-b border-gray-300">
                        <input type="checkbox" value="${item.id_tagihan}" class="billing-checkbox bg-transparent peer mr-2 appearance-none h-4 w-4 border-2 rounded-full hover:border-teal-500 cursor-pointer border-teal-300"
                            data-id-siswa="${item.id_siswa}"
                            data-id-tagihan="${item.id_tagihan}"
                            data-nama-siswa="${student.nama_siswa}"
                            data-tanggal-tagihan="${item.tanggal_tagihan}"
                            data-tagihan="${item.tagihan}" checked>
                    </td>
                    <td class="py-2 px-4 border-b border-gray-300">${item.name_tagihan ? item.name_tagihan : '-'}</td>
                    <td class="py-2 px-4 border-b">${item.tanggal_tagihan}</td>
                    <td class="py-2 px-4 border-b">Rp ${Number(item.tagihan).toLocaleString('id-ID')}</td>
                    <td class="py-2 px-4 border-b">${item.tanggal_lunas ? item.tanggal_lunas : "<span class='inline-block bg-red-500 text-white px-2 py-1 rounded-full text-xs shadow-md'>Unpaid</span>"}</td>
                                    <td class="py-2 px-4 border-b">${item.lunas == 1 ? "<span class='inline-block bg-green-500 text-white px-2 py-1 rounded-full text-xs shadow-md'>L</span>" : "<span class='inline-block bg-red-500 text-white px-2 py-1 rounded-full text-xs shadow-md'>B</span>"}</td>
                </tr>`;
                billingDataAngkatan.insertAdjacentHTML('beforeend', row);
            });
        });

        addCheckboxListeners();
    }

    function addCheckboxListeners() {
        const checkboxes = document.querySelectorAll('.billing-checkbox');
        checkboxes.forEach(function(checkbox) {
            checkbox.addEventListener('change', function() {
                const id_siswa = this.dataset.idSiswa;
                const nama_siswa = this.dataset.namaSiswa;
                const name_tagihan = this.dataset.nameTagihan;
                const tanggal_tagihan = this.dataset.tanggalTagihan;
                const tagihan = Number(this.dataset.tagihan).toLocaleString('id-ID');
                const id_tagihan = this.value;

                if (this.checked) {
                    // Jika belum ada, buat array untuk siswa ini
                    if (!reminderMessages[id_siswa]) {
                        reminderMessages[id_siswa] = [];
                    }

                    // Buat pesan baru sebagai objek
                    const message = {
                        id_tagihan: id_tagihan,
                        message: reminderTemplates[Math.floor(Math.random() * reminderTemplates.length)]
                            .replace('{nama_siswa}', nama_siswa)
                            .replace('{nama_tagihan}', name_tagihan || "-")
                            .replace('{tagihan}',  `Rp ${tagihan}`)
                            .replace('{tgl_tagihan}', tanggal_tagihan)
                    };

                    // Tambahkan pesan ke array untuk siswa ini
                    reminderMessages[id_siswa].push(message);
                } else {
                    // Jika checkbox tidak tercentang, hapus pesan yang sesuai
                    reminderMessages[id_siswa] = reminderMessages[id_siswa].filter(msg => msg.id_tagihan !== id_tagihan);
                    if (reminderMessages[id_siswa].length === 0) {
                        delete reminderMessages[id_siswa];
                    }
                }

                updateReminderBox();
            });

            // Trigger perubahan jika checkbox sudah tercentang
            if (checkbox.checked) {
                checkbox.dispatchEvent(new Event('change'));
            }
        });
    }

    function updateReminderBox() {
        reminderBoxAngkatan.innerHTML = '';

        if (Object.keys(reminderMessages).length === 0) {
            reminderBoxAngkatan.textContent = 'Pesan reminder akan muncul di sini';
        } else {
            Object.entries(reminderMessages).forEach(([id_siswa, messages]) => {
                messages.forEach(({ id_tagihan, message }) => {
                    reminderBoxAngkatan.insertAdjacentHTML('beforeend', `<div data-id-tagihan="${id_tagihan}">${message}</div>`);
                });
            });
        }

        const hiddenContent = reminderMessages;
        document.getElementById('hiddenReminderContent').value = JSON.stringify(hiddenContent);

        // console.log('remindermessage:', reminderMessages);
    }
    methodSelect.addEventListener('change', function() {
        reminderBoxAngkatan.textContent = '';
        reminderMessages = {};
        billingDataAngkatan.innerHTML = `
        <tr>
            <td colspan="6" class="text-center font-semibold text-slate-900 py-4">
                Data tagihan tidak tersedia.
            </td>
        </tr>
        <tr>
            <td colspan="6" class="text-center font-semibold text-slate-900 tetx-balance w-3/4">
                Silakan pilih siswa, kelas, atau angkatan untuk melihat data tagihan.
            </td>
        </tr>`;
        document.getElementById('hiddenReminderContent').value = JSON.stringify(reminderMessages);  // Clear hidden input
        
    });
});




