// 1. STRUKTUR BIAYA (ubah angka di sini
const HARGA_WORKSHOP = {
  frontend: 150000,
  uiux: 125000,
  cyber: 175000
};
 
const NAMA_WORKSHOP = {
  frontend: "Front-End Web",
  uiux: "UI/UX Design",
  cyber: "Cybersecurity Dasar"
};

const DISKON_MAHASISWA = 0.2; // peserta bertipe Mahasiswa mendapat diskon 20%
 
// 2. AMBIL ELEMEN DOM
const form = document.getElementById("formDaftar");
const ringkasan = document.getElementById("ringkasan");
 
const inputNama = document.getElementById("nama");
const inputEmail = document.getElementById("email");
const inputHp = document.getElementById("hp");
const inputTanggal = document.getElementById("tanggal");
 
// 3. FUNCTION BANTUAN
 
// Mengubah angka menjadi format rupiah, contoh: 150000 -> Rp150.000
function formatRupiah(angka) {
  return "Rp" + angka.toLocaleString("id-ID");
}
 
// Mencegah teks dari pengguna dibaca sebagai kode HTML
function amankanTeks(teks) {
  return teks
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
 
// Menampilkan atau menghapus pesan error pada satu field
function setError(input, idPesan, pesan) {
  const kotakPesan = document.getElementById(idPesan);
  kotakPesan.textContent = pesan;
  if (input) {
    if (pesan !== "") {
      input.classList.add("input-error");
    } else {
      input.classList.remove("input-error");
    }
  }
}
 
// 4. VALIDASI
// Mengembalikan true jika semua data valid, false jika ada yang salah
function validasiForm() {
  let valid = true;
 
  // Nama tidak boleh kosong
  const nama = inputNama.value.trim();
  if (nama === "") {
    setError(inputNama, "errNama", "Nama wajib diisi.");
    valid = false;
  } else {
    setError(inputNama, "errNama", "");
  }
 
  // Email harus terisi dan berformat benar
  const email = inputEmail.value.trim();
  const polaEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email === "") {
    setError(inputEmail, "errEmail", "Email wajib diisi.");
    valid = false;
  } else if (!polaEmail.test(email)) {
    setError(inputEmail, "errEmail", "Format email tidak valid. Contoh: nama@email.com");
    valid = false;
  } else {
    setError(inputEmail, "errEmail", "");
  }
 
  // Nomor HP: diawali 08, total 10-13 digit angka
  const hp = inputHp.value.trim();
  const polaHp = /^08\d{8,11}$/;
  if (!polaHp.test(hp)) {
    setError(inputHp, "errHp", "Nomor HP harus diawali 08 dan berisi 10-13 angka.");
    valid = false;
  } else {
    setError(inputHp, "errHp", "");
  }
 
  // Tanggal harus dipilih dan berada dalam rentang min-max
  const tanggal = inputTanggal.value;
  if (tanggal === "") {
    setError(inputTanggal, "errTanggal", "Tanggal hadir wajib dipilih.");
    valid = false;
  } else if (tanggal < inputTanggal.min || tanggal > inputTanggal.max) {
    setError(inputTanggal, "errTanggal", "Pilih tanggal antara 20 dan 22 Oktober 2026.");
    valid = false;
  } else {
    setError(inputTanggal, "errTanggal", "");
  }
 
  // Minimal satu workshop dipilih
  const jumlahDipilih = document.querySelectorAll('input[name="workshop"]:checked').length;
  if (jumlahDipilih === 0) {
    setError(null, "errWorkshop", "Pilih minimal satu workshop.");
    valid = false;
  } else {
    setError(null, "errWorkshop", "");
  }
 
  return valid;
}
 
// 5. HITUNG BIAYA & TAMPILKAN RINGKASAN
function prosesPendaftaran() {
  // Ambil data dari form
  const nama = inputNama.value.trim();
  const tipe = document.querySelector('input[name="tipe"]:checked').value;
  const tanggal = inputTanggal.value;
  const sesi = document.getElementById("sesi").value;
 
  // PERULANGAN: telusuri semua checkbox workshop yang dicentang
  const pilihan = document.querySelectorAll('input[name="workshop"]:checked');
  let subtotal = 0;
  let daftarWorkshop = "";
 
  for (let i = 0; i < pilihan.length; i++) {
    const kode = pilihan[i].value;
    subtotal += HARGA_WORKSHOP[kode];
    daftarWorkshop += "<li>" + NAMA_WORKSHOP[kode] + " (" + formatRupiah(HARGA_WORKSHOP[kode]) + ")</li>";
  }
 
  // PERCABANGAN: diskon hanya untuk Mahasiswa
  let diskon = 0;
  if (tipe === "Mahasiswa") {
    diskon = subtotal * DISKON_MAHASISWA;
  }
  const total = subtotal - diskon;
 
  // MANIPULASI DOM: tulis ringkasan ke dalam kotak #ringkasan
  let html = "<h3 class='h5'>Ringkasan Pendaftaran</h3>";
  html += "<p class='mb-1'><strong>Nama:</strong> " + amankanTeks(nama) + "</p>";
  html += "<p class='mb-1'><strong>Tipe peserta:</strong> " + tipe + "</p>";
  html += "<p class='mb-1'><strong>Tanggal hadir:</strong> " + tanggal + "</p>";
  html += "<p class='mb-1'><strong>Sesi:</strong> " + sesi + "</p>";
  html += "<p class='mb-1'><strong>Workshop:</strong></p><ul>" + daftarWorkshop + "</ul>";
  html += "<p class='mb-1'>Subtotal: " + formatRupiah(subtotal) + "</p>";
 
  if (diskon > 0) {
    html += "<p class='mb-2'>Diskon mahasiswa (20%): -" + formatRupiah(diskon) + "</p>";
  }
 
  html += "<p class='total-biaya'>Total biaya: " + formatRupiah(total) + "</p>";
 
  ringkasan.innerHTML = html;
  ringkasan.classList.add("aktif");
}
 
// 6. EVENT LISTENER
 
// Submit form: validasi dulu, tampilkan ringkasan hanya jika valid
form.addEventListener("submit", function (event) {
  event.preventDefault(); // cegah halaman reload
 
  if (validasiForm()) {
    prosesPendaftaran();
    ringkasan.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    // validasi gagal: kembalikan ringkasan ke kondisi awal
    ringkasan.classList.remove("aktif");
    ringkasan.innerHTML =
      "<h3 class='h5'>Ringkasan Pendaftaran</h3>" +
      "<p class='text-muted mb-0'>Periksa kembali data yang ditandai merah.</p>";
  }
});
 
// Reset form: bersihkan pesan error dan ringkasan
form.addEventListener("reset", function () {
  setError(inputNama, "errNama", "");
  setError(inputEmail, "errEmail", "");
  setError(inputHp, "errHp", "");
  setError(inputTanggal, "errTanggal", "");
  setError(null, "errWorkshop", "");
 
  ringkasan.classList.remove("aktif");
  ringkasan.innerHTML =
    "<h3 class='h5'>Ringkasan Pendaftaran</h3>" +
    "<p class='text-muted mb-0'>Isi formulir lalu klik Daftar. Ringkasan akan muncul di sini.</p>";
});