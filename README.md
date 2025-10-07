# Football Shop — Tugas 5 PBP
Link PWS: https://naomyscha-attalie-footballshop.pbp.cs.ui.ac.id/


# Apa perbedaan antara synchronous request dan asynchronous request?
- Synchronous (sync): Browser kirim request → nunggu respons → baru render ulang halaman. UI “terkunci” selama menunggu.
- Asynchronous (async/AJAX): Browser kirim request di belakang layar (XHR/fetch) → tidak blok UI → respons dipakai untuk memperbarui sebagian halaman (DOM) tanpa reload penuh.

# Bagaimana AJAX bekerja di Django (alur request–response)?
1. Event di front-end (klik tombol “Refresh”, submit modal Add Product).
2. JS fetch() → kirim request ke endpoint Django (biasanya JsonResponse), sertakan CSRF token untuk metode tulis.
3. Django view proses data (validasi, otorisasi, DB), lalu balas JSON atau status HTTP (201/400/401/403).
4. JS menerima JSON → update state (list produk), manipulasi DOM (render grid, tampilkan toast/loading/error) tanpa reload.
Intinya: template utama dirender sekali (shell). Data inti masuk/diubah lewat AJAX → partial update di browser.

# Apa keuntungan menggunakan AJAX dibandingkan render biasa di Django?
- UX lebih cepat & halus: tidak ada full page reload; hanya elemen yang berubah yang di-update.
- Lebih interaktif: modal form, inline validation, toast, loading/empty/error state.
- Lebih hemat bandwidth: payload JSON lebih kecil dibanding render ulang HTML penuh.
- Arsitektur rapi: pisah presentasi (template shell) dan data (endpoint JSON), memudahkan reuse (mis. buat mobile app).

# Bagaimana cara memastikan keamanan saat menggunakan AJAX untuk fitur Login dan Register di Django?
Server-side
- CSRF protection: aktifkan middleware bawaan; kirim token ke fetch (header X-CSRFToken).
- Validasi & sanitasi: gunakan Form/Serializer; untuk field teks bebas, strip_tags di view/form.
- Session/HTTPS: pakai HTTPS, cookie HttpOnly, SECURE_* flags, rotasi session saat login (hindari session fixation).
- Rate limiting/brute-force: batasi percobaan login (mis. django-axes) dan log IP/UA.
- Auth check di server: owner-only actions tetap dicek di view (jangan hanya andalkan sembunyi tombol di UI).
Client-side
- DOMPurify saat memasukkan string tak tepercaya ke innerHTML.
- Jangan memaparkan data sensitif di JS/HTML (mis. token rahasia).
- Tangani error status (401/403/400) dengan jelas (toast), jangan diam-diam.
Contoh header CSRF di fetch:
fetch(url, {
  method: 'POST',
  headers: { 'X-CSRFToken': getCookie('csrftoken') },
  body: formData
})

# Bagaimana AJAX mempengaruhi pengalaman pengguna (User Experience) pada website?
- Responsif & mulus: aksi (create/update/delete) terasa instan dengan loading kecil, toast sukses/gagal, dan tanpa reload.
- Kognitif ringan: modal menjaga fokus; state empty/error memberi konteks yang jelas.
- Mobile-friendly: lebih cepat dan hemat data; cocok dipadukan dengan Grid responsif.
- Consistency: pola UI konsisten (tombol Refresh, toast, modal konfirmasi) meningkatkan kepercayaan pengguna.
