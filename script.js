// Ganti dengan URL Google Apps Script Anda
const API_URL = "https://script.google.com/macros/s/AKfycbwGp4s-RRJQPHcwxHFOECnFrKjI9GxShSIoOSGuh3YHNH9MZgOLez3sxk0tg0xSWVYK/exec";

// Ambil elemen-elemen dari DOM
const mataPelajaranInput = document.getElementById('mataPelajaran');
const namaGuruInput = document.getElementById('namaGuru');
const waktuInput = document.getElementById('waktu');
const ruangInput = document.getElementById('ruang');
const dataForm = document.getElementById('dataForm');
const rowIndexInput = document.getElementById('rowIndex');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const dataTableBody = document.querySelector('#dataTable tbody');

// Fungsi untuk membaca/menampilkan semua data
async function fetchAndDisplayData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // Bersihkan tabel sebelum menambahkan data baru
        dataTableBody.innerHTML = '';

        data.forEach((row, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.mataPelajaran}</td>
                <td>${row.guru}</td>
                <td>${row.waktu}</td>
                <td>${row.ruang}</td>
                <td class="action-buttons">
                    <button class="edit-btn" onclick="editData(${index}, '${row.mataPelajaran}', '${row.guru}', '${row.waktu}', '${row.ruang}')">Edit</button>
                    <button class="delete-btn" onclick="deleteData(${index})">Hapus</button>
                </td>
            `;
            dataTableBody.appendChild(tr);
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        alert('Gagal mengambil data. Cek koneksi atau URL API.');
    }
}

// Fungsi untuk menangani tambah/edit data
dataForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const mataPelajaran = mataPelajaranInput.value;
    const namaGuru = namaGuruInput.value;
    const waktu = waktuInput.value;
    const ruang = ruangInput.value;
    const rowIndex = rowIndexInput.value;

    let url, method, body;

    if (rowIndex) {
        // UPDATE
        url = `${API_URL}?action=update&rowIndex=${rowIndex}`;
        method = 'POST';
        body = JSON.stringify({ mataPelajaran, namaGuru, waktu, ruang });
    } else {
        // CREATE
        url = `${API_URL}?action=create`;
        method = 'POST';
        body = JSON.stringify({ mataPelajaran, namaGuru, waktu, ruang });
    }

    try {
        const response = await fetch(url, {
            method,
            body,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();
        if (result.status === 'success') {
            alert(result.message);
            dataForm.reset();
            rowIndexInput.value = '';
            submitBtn.textContent = 'Tambah Data';
            cancelBtn.style.display = 'none';
            fetchAndDisplayData();
        } else {
            alert('Aksi gagal: ' + result.message);
        }
    } catch (error) {
        console.error('Error submitting data:', error);
        alert('Gagal mengirim data. Cek koneksi atau URL API.');
    }
});

// Fungsi untuk mengisi form saat edit
function editData(index, mataPelajaran, guru, waktu, ruang) {
    rowIndexInput.value = index;
    mataPelajaranInput.value = mataPelajaran;
    namaGuruInput.value = guru;
    waktuInput.value = waktu;
    ruangInput.value = ruang;

    submitBtn.textContent = 'Perbarui Data';
    cancelBtn.style.display = 'inline-block';
}

// Fungsi untuk membatalkan edit
cancelBtn.addEventListener('click', () => {
    dataForm.reset();
    rowIndexInput.value = '';
    submitBtn.textContent = 'Tambah Data';
    cancelBtn.style.display = 'none';
});

// Fungsi untuk menghapus data
async function deleteData(rowIndex) {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;

    const url = `${API_URL}?action=delete&rowIndex=${rowIndex}`;

    try {
        const response = await fetch(url);
        const result = await response.json();
        if (result.status === 'success') {
            alert(result.message);
            fetchAndDisplayData();
        } else {
            alert('Gagal menghapus data: ' + result.message);
        }
    } catch (error) {
        console.error('Error deleting data:', error);
        alert('Gagal menghapus data. Cek koneksi atau URL API.');
    }
}

// Muat data saat halaman dimuat
document.addEventListener('DOMContentLoaded', fetchAndDisplayData);
