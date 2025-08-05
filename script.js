// Ganti dengan URL Google Apps Script Anda
const API_URL = "https://script.google.com/macros/s/AKfycbyIVNKHdYDw6hIgmKwDmooydHILIpUziRxqtDWwKWexDThkjkMg4avTT2ZpH6uZSf0KyQ/exec";

// Ambil elemen-elemen dari DOM
const dataForm = document.getElementById('dataForm');
const dataTableBody = document.querySelector('#dataTable tbody');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const rowIndexInput = document.getElementById('rowIndex');
const namaInput = document.getElementById('nama');
const emailInput = document.getElementById('email');

// Fungsi untuk membaca/menampilkan semua data (READ)
async function fetchAndDisplayData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // Bersihkan tabel sebelum menambahkan data baru
        dataTableBody.innerHTML = '';
        
        data.forEach((row, index) => {
            if (index === 0) return; // Lewati baris header

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row[0]}</td>
                <td>${row[1]}</td>
                <td class="action-buttons">
                    <button class="edit-btn" onclick="editData(${index}, '${row[0]}', '${row[1]}')">Edit</button>
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

// Fungsi untuk menangani penambahan atau pembaruan data (CREATE & UPDATE)
dataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nama = namaInput.value;
    const email = emailInput.value;
    const rowIndex = rowIndexInput.value;
    
    let url;
    let method;
    let body;

    if (rowIndex) {
        // Mode UPDATE
        url = `${API_URL}?action=update&rowIndex=${rowIndex}`;
        method = 'POST'; // Google Apps Script seringkali menggunakan POST untuk aksi
        body = JSON.stringify({ nama, email });
    } else {
        // Mode CREATE
        url = `${API_URL}?action=create`;
        method = 'POST';
        body = JSON.stringify({ nama, email });
    }

    try {
        const response = await fetch(url, {
            method: method,
            body: body,
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
            fetchAndDisplayData(); // Muat ulang data
        } else {
            alert('Aksi gagal: ' + result.message);
        }

    } catch (error) {
        console.error('Error submitting data:', error);
        alert('Gagal mengirim data. Cek koneksi atau URL API.');
    }
});

// Fungsi untuk mengisi form saat tombol Edit diklik
function editData(rowIndex, nama, email) {
    rowIndexInput.value = rowIndex;
    namaInput.value = nama;
    emailInput.value = email;
    submitBtn.textContent = 'Perbarui Data';
    cancelBtn.style.display = 'inline-block';
}

// Fungsi untuk membatalkan mode edit
cancelBtn.addEventListener('click', () => {
    dataForm.reset();
    rowIndexInput.value = '';
    submitBtn.textContent = 'Tambah Data';
    cancelBtn.style.display = 'none';
});

// Fungsi untuk menghapus data (DELETE)
async function deleteData(rowIndex) {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        return;
    }
    
    const url = `${API_URL}?action=delete&rowIndex=${rowIndex}`;
    
    try {
        const response = await fetch(url, {
            method: 'GET' // Google Apps Script seringkali menggunakan GET untuk aksi sederhana
        });

        const result = await response.json();
        if (result.status === 'success') {
            alert(result.message);
            fetchAndDisplayData(); // Muat ulang data
        } else {
            alert('Penghapusan gagal: ' + result.message);
        }

    } catch (error) {
        console.error('Error deleting data:', error);
        alert('Gagal menghapus data. Cek koneksi atau URL API.');
    }
}

// Panggil fungsi ini saat halaman pertama kali dimuat
document.addEventListener('DOMContentLoaded', fetchAndDisplayData);
