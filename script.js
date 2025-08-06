// Ganti dengan URL Web App yang kamu dapat dari Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbwB3PL5UvLmraWjZGoXkFMKdpu8Shw4aQJyMQNDVypueZh69-L1alaw4KWeOQsJHR10/exec";

const mataPelajaranInput = document.getElementById('mataPelajaran');
const namaGuruInput = document.getElementById('namaGuru');
const waktuInput = document.getElementById('waktu');
const ruangInput = document.getElementById('ruang');
const dataForm = document.getElementById('dataForm');
const rowIndexInput = document.getElementById('rowIndex');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const dataTableBody = document.querySelector('#dataTable tbody');

async function fetchAndDisplayData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

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

dataForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const mataPelajaran = mataPelajaranInput.value;
    const namaGuru = namaGuruInput.value;
    const waktu = waktuInput.value;
    const ruang = ruangInput.value;
    const rowIndex = rowIndexInput.value;

    const formData = new FormData();
    formData.append('action', rowIndex ? 'update' : 'create');
    formData.append('rowIndex', rowIndex);
    formData.append('data', JSON.stringify({ mataPelajaran, namaGuru, waktu, ruang }));

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData
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

function editData(index, mataPelajaran, guru, waktu, ruang) {
    rowIndexInput.value = index;
    mataPelajaranInput.value = mataPelajaran;
    namaGuruInput.value = guru;
    waktuInput.value = waktu;
    ruangInput.value = ruang;

    submitBtn.textContent = 'Perbarui Data';
    cancelBtn.style.display = 'inline-block';
}

cancelBtn.addEventListener('click', () => {
    dataForm.reset();
    rowIndexInput.value = '';
    submitBtn.textContent = 'Tambah Data';
    cancelBtn.style.display = 'none';
});

async function deleteData(rowIndex) {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;

    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('rowIndex', rowIndex);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });

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

document.addEventListener('DOMContentLoaded', fetchAndDisplayData);
