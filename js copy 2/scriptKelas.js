
document.addEventListener('DOMContentLoaded', function() {
    const billingDataKelas = document.getElementById('dataTagihan');
    const noDataMessage = document.getElementById('noDataMessage');
    const reminderBoxKelas = document.getElementById('reminderbox');
    let reminderMessages = {};
    const reminderTemplates = [
        "Assalamualaikum Wr Wb,\n\nSalam sejahtera bagi kita semua. Kami ingin menginformasikan kepada Anda, orang tua ananda *{nama_siswa}*, untuk tunggakan tagihan anak Anda sebesar *{jumlah_tagihan}*.\n\nDengan Rincian Tagihan: \n\n{rincian}\n\nDemikian pesan dari kami. Wassalam 🙏.\n\n*pesan dari *{nama_sekolah}*.\n\n*silahkan hubungi admin sekolah jika ada kesalahan tagihan atau nama siswa*.",
        "Selamat pagi/siang/malam, Bapak/Ibu. \n\nKami ingin mengingatkan bahwa tunggakan tagihan untuk ananda *{nama_siswa}* sebesar *{jumlah_tagihan}* sudah jatuh tempo.\n\nRincian Tagihan: \n\n{rincian}\n\nTerima kasih atas perhatiannya. Salam hormat dari kami 🙏.\n\n*pesan otomatis dari *{nama_sekolah}*\n\n*silahkan hubungi admin sekolah jika ada kesalahan tagihan atau nama siswa*",
        "*Permisi Bapak/Ibu, berikut ini merupakan pesan pengingat untuk tunggakan tagihan sekolah yang dimiliki ananda *{nama_siswa}* yang berjumlah *{jumlah_tagihan}*.\n\nDengan Rincian Tagihannya: \n\n{rincian}\n\nKami harap Bapak/Ibu dapat segera melunasi beban tagihan tersebut. Terima kasih. Wassalamualaikum Wr Wb 🙏.\n\n*silahkan hubungi admin sekolah jika ada kesalahan tagihan atau nama siswa*",
        "Dengan hormat, kami sampaikan kepada Bapak/Ibu, bahwa tunggakan tagihan untuk ananda *{nama_siswa}* sebesar *{jumlah_tagihan}* sudah harus dibayarkan.\n\nRincian Tagihan: \n\n{rincian}\n\nTerima kasih atas perhatian dan kerja samanya. Wassalam 🙏.\n\n*pesan otomatis dari *{nama_sekolah}*\n\n*silahkan hubungi admin sekolah jika ada kesalahan tagihan atau nama siswa*",
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
    

    document.getElementById('kelas').addEventListener('change', function() {
        const kelas = this.value;
        billingDataKelas.innerHTML = '';
        noDataMessage.style.display = 'none';
        reminderBoxKelas.textContent = '';

        if (kelas) {
            const loadingKelas = `<tr>
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

                billingDataKelas.innerHTML = loadingKelas;

                fetch('../Config/fetchTagihanKelas.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({ 'kelas': kelas })
                })
                .then(response => response.json())
                .then(data => {
                    billingDataKelas.innerHTML = '';
                    noDataMessage.style.display = 'none';
                    reminderBoxKelas.textContent = '';
        
                    if (data.error) {
                        alert(data.error);
                    } else if (data.message) {
                        alert(data.message);
                    } else if (data.length === 0) {
                        noDataMessage.style.display = 'block';
                    } else {
                        reminderMessages = {};  // Reset pesan reminder
        
                        const groupedData = data.reduce((acc, tagihan) => {
                            const namaSiswa = tagihan.nama_siswa;
                            if (!acc[namaSiswa]) {
                                acc[namaSiswa] = [];
                            }
                            acc[namaSiswa].push(tagihan);
                            return acc;
                        }, {});
        
                        function getSelectedSchool() {
                            const selectElement = document.getElementById('sekolah');
                            const selectedSchool = selectElement.value;
                            return selectedSchool;
                        }
        
                        // Contoh penggunaan di dalam fungsi updateReminderBox
                        const namaSekolah = getSelectedSchool();
        
                        Object.keys(groupedData).forEach(namaSiswa => {
                            const siswaRow = document.createElement('tr');
                            siswaRow.innerHTML = `<td class="py-2 px-4 font-semibold border-b border-gray-700" colspan="6">${namaSiswa}</td>`;
                            billingDataKelas.appendChild(siswaRow);
        
                            groupedData[namaSiswa].forEach(tagihan => {
                                const row = `
                                <tr>
                                    <td class="py-2 px-4 border-b">
                                        <input type="checkbox" value="${tagihan.id_tagihan}" class="billing-checkbox bg-transparent peer mr-2 appearance-none h-4 w-4 border-2 rounded-full hover:border-teal-500 cursor-pointer border-teal-300"
                                            data-id-siswa="${tagihan.id_siswa}"
                                            data-id-tagihan="${tagihan.id_tagihan}"
                                            data-id-tagihan="${tagihan.id_tagihan}"
                                            data-nama-siswa="${namaSiswa}"
                                            data-tanggal-tagihan="${tagihan.tanggal_tagihan}"
                                            data-tagihan="${tagihan.tagihan}" checked>
                                    </td>
                                     <td class="py-2 px-4 border-b border-gray-300">${tagihan.name_tagihan ? tagihan.name_tagihan : '-'}</td>
                                    <td class="py-2 px-4 border-b">${tagihan.tanggal_tagihan}</td>
                                    <td class="py-2 px-4 border-b">Rp ${Number(tagihan.tagihan).toLocaleString('id-ID')}</td>
                                    <td class="py-2 px-4 border-b">${tagihan.tanggal_lunas ? tagihan.tanggal_lunas : "<span class='inline-block bg-red-500 text-white px-2 py-1 rounded-full text-xs shadow-md'>Unpaid</span>"}</td>
                                    <td class="py-2 px-4 border-b">${tagihan.lunas == 1 ? "<span class='inline-block bg-green-500 text-white px-2 py-1 rounded-full text-xs shadow-md'>L</span>" : "<span class='inline-block bg-red-500 text-white px-2 py-1 rounded-full text-xs shadow-md'>B</span>"}</td>
                                </tr>`;
                            billingDataKelas.insertAdjacentHTML('beforeend', row);
                            });
                        });
        
                        document.querySelectorAll('.billing-checkbox').forEach(function (checkbox) {
                            const id_siswa = checkbox.dataset.idSiswa;
                            const nama_siswa = checkbox.dataset.namaSiswa;
        
                            // Function to update the reminder message based on selected checkboxes
                            function updateReminderMessage() {
                                const selectedTagihan = groupedData[nama_siswa].filter(tagihan => {
                                    return document.querySelector(`.billing-checkbox[value="${tagihan.id_tagihan}"]`).checked;
                                });
        
                                // Calculate total and details for selected tagihan
                                const totalTagihan = selectedTagihan.reduce((sum, item) => sum + Number(item.tagihan), 0);
                                const rincian = selectedTagihan.map(item => `\u00A0\u00A0\u00A0\u00A0*- ${item.name_tagihan || '-'}: Rp ${Number(item.tagihan).toLocaleString('id-ID')}*`).join('\n');
        
                                if (selectedTagihan.length > 0) {
                                    const message = reminderTemplates[Math.floor(Math.random() * reminderTemplates.length)]
                                        .replace('{nama_siswa}', nama_siswa)
                                        .replace('{rincian}', rincian)
                                        .replace('{jumlah_tagihan}', `Rp${totalTagihan.toLocaleString('id-ID')}`)
                                        .replace('{nama_sekolah}', namaSekolah);
        
                                    reminderMessages[id_siswa] = [{ id_tagihan: this.value, message: message }];
                                } else {
                                    delete reminderMessages[id_siswa]; // Delete if no checkboxes are selected
                                }
        
                                updateReminderBox();
                            }
        
                            // Initial calculation for checked boxes
                            updateReminderMessage(); // Automatically trigger update for checked boxes on page load
        
                            checkbox.addEventListener('change', function () {
                                updateReminderMessage(); // Update message when checkbox status changes
                            });
                        });
        
                        // Automatically show reminder messages after page load
                        updateReminderBox();
        
                        function updateReminderBox() {
                            reminderBoxKelas.innerHTML = ''; 
        
                            if (Object.keys(reminderMessages).length === 0) {
                                reminderBoxKelas.textContent = 'Pesan reminder akan muncul di sini';
                            } else {
                                reminderBoxKelas.innerHTML = '';
        
                                Object.entries(reminderMessages).forEach(([id_siswa, messages]) => {
                                    messages.forEach(({ id_tagihan, message }) => {
                                        reminderBoxKelas.insertAdjacentHTML('beforeend', `<div data-id-tagihan="${id_tagihan}">${message}</div>`);
                                    });
                                });
                            }
        
                            document.getElementById('hiddenReminderContent').value = JSON.stringify(reminderMessages);
                        }
                    }
                })
                .catch(error => {
                    billingDataKelas.innerHTML = '';
                    noDataMessage.style.display = 'block';
                    console.error('Error:', error);
                });
            } else {
                noDataMessage.style.display = 'block';
            }
        });
    })