# Football Shop — Tugas 4 PBP
Link PWS: https://naomyscha-attalie-footballshop.pbp.cs.ui.ac.id/

# 1. Urutan prioritas pengambilan CSS selector
Jika terdapat beberapa CSS selector yang mengatur elemen yang sama, maka browser akan menentukan prioritas dengan aturan yang disebut specificity. Urutannya adalah sebagai berikut:
- Paling tinggi adalah aturan yang menggunakan !important
- Selanjutnya adalah inline style, yaitu CSS yang ditulis langsung di atribut elemen HTML.
- Berikutnya adalah selector berbasis ID.
- Setelah itu selector berbasis class, atribut, atau pseudo-class (seperti :hover).
- Paling rendah adalah selector berbasis tag/elemen dan pseudo-element (seperti p, h1, atau ::before).

Jika terdapat selector dengan tingkat prioritas yang sama, maka aturan yang ditulis paling akhir di dalam CSS akan dipakai.

# 2. Pentingnya responsive design
Responsive design adalah konsep desain web yang memastikan tampilan aplikasi menyesuaikan diri dengan berbagai ukuran layar, baik pada ponsel, tablet, maupun komputer. Konsep ini penting karena mayoritas pengguna internet saat ini mengakses melalui perangkat mobile. Dengan desain yang responsif, pengalaman pengguna menjadi lebih baik, mudah diakses, dan tidak memerlukan pengembangan aplikasi terpisah untuk setiap perangkat.

Sebagai contoh, aplikasi marketplace modern seperti Tokopedia atau Shopee sudah menerapkan responsive design. Tampilan mereka otomatis menyesuaikan ukuran layar sehingga nyaman dipakai di perangkat apa pun. Sebaliknya, beberapa website lama yang masih menggunakan layout berbasis tabel dengan lebar tetap belum menerapkan responsive design. Hasilnya, pengguna harus melakukan scroll horizontal di ponsel, tombol terlihat kecil, dan navigasi menjadi sulit.

# 3. Perbedaan margin, border, dan padding
- Margin adalah jarak di luar batas elemen, berfungsi untuk memberi ruang antara satu elemen dengan elemen lain.
- Border adalah garis tepi yang membungkus elemen, letaknya di antara margin dan padding.
- Padding adalah jarak di dalam elemen, yaitu ruang antara isi konten (seperti teks atau gambar) dengan garis tepi elemen.

Ketiganya dipakai untuk mengatur tata letak agar elemen tidak saling menempel, terlihat lebih rapi, dan mudah dibaca.


# 4. Konsep Flexbox dan Grid Layout serta Kegunaannya
Flexbox adalah model tata letak satu dimensi yang mengatur elemen dalam satu arah utama: baris atau kolom. Kelebihan utamanya adalah kemudahan menyusun, meratakan, dan mendistribusikan ruang antar elemen secara fleksibel, termasuk ketika ukuran layar berubah. Flexbox sangat berguna untuk menyusun elemen pada navbar, deretan tombol, kartu yang disejajarkan mendatar, serta pusat-rata (align dan justify) konten secara vertikal maupun horizontal.

Grid Layout adalah model tata letak dua dimensi yang memungkinkan pengaturan baris dan kolom secara bersamaan. Dengan grid, pengembang dapat merancang struktur halaman yang kompleks—misalnya galeri kartu produk, dashboard, atau majalah—dengan kontrol area yang lebih presisi. Grid sangat cocok untuk daftar produk yang perlu berubah dari satu kolom di ponsel menjadi dua atau tiga kolom di tablet dan desktop.

Intinya: gunakan Flexbox untuk penyusunan baris/kolom sederhana dan perataan elemen, gunakan Grid untuk struktur dua dimensi yang membutuhkan kontrol baris dan kolom sekaligus.

# 5. Step-by-Step Implementasi Checklist 

1) Implementasi Edit dan Hapus Product
- Menambahkan rute dan view untuk mengubah dan menghapus produk pada aplikasi.
- Mengatur agar fitur Edit dan Delete hanya dapat dilakukan oleh pemilik data (pengguna yang sedang masuk).
- Setelah data diubah atau dihapus, pengguna diarahkan kembali ke daftar produk dengan pesan status yang sesuai.
2) Kustomisasi Desain dengan CSS/Framework
- Menambahkan framework gaya (Tailwind) melalui base layout agar seluruh halaman (login, register, tambah, edit, detail, dan daftar) memiliki tampilan konsisten.
- Menetapkan palet warna, jarak, dan komponen dasar seperti tombol, kartu, dan panel, sehingga antarmuka terasa seragam dan mudah dipahami.
3) Kustomisasi Halaman Login dan Register
- Mengubah halaman autentikasi supaya lebih menarik: penempatan formulir di tengah layar, kartu putih dengan bayangan ringan, dan tombol yang kontras.
- Menambahkan pesan kesalahan dan tautan yang jelas antara halaman login dan register untuk memudahkan navigasi pengguna.
4) Kustomisasi Halaman Tambah dan Edit Product
- Membuat tampilan formulir yang bersih: judul halaman, tombol kembali, bagian formulir yang rapi, dan tombol simpan/perbarui yang tegas.
- Menampilkan pesan validasi bila input belum sesuai, sehingga pengguna tahu apa yang harus diperbaiki.
5) Kustomisasi Halaman Detail Product
- Menampilkan informasi produk secara lengkap dan terstruktur: gambar, nama, kategori, harga, dan deskripsi.
- Menjaga konsistensi gaya agar selaras dengan halaman daftar dan formulir.
6) Kustomisasi Halaman Daftar Product yang Menarik dan Responsif
- Menggunakan Grid Layout untuk menampilkan kartu produk: satu kolom di ponsel, dua kolom di tablet, dan tiga kolom di desktop.
- Empty state: bila belum ada produk, menampilkan ilustrasi dan pesan yang ramah, serta tombol untuk menambah produk.
- Kartu produk: setiap kartu berisi gambar, nama, kategori, harga, dan tombol Detail.
- Tombol Edit dan Delete wajib ada pada setiap kartu, namun hanya terlihat untuk pemilik data; penempatannya dibuat rapi (misalnya di bagian bawah kartu) agar tidak mengganggu fokus konten.
7) Navbar yang Responsif (Mobile dan Desktop)
- Membuat navbar dengan logo, tautan ke fitur utama (misalnya daftar produk, tambah produk), serta tombol Login/Register atau Logout berdasarkan status pengguna.
- Untuk ponsel, menambahkan tombol hamburger yang membuka menu tarik-turun; untuk desktop, menu tampil mendatar.
- Menjaga keterbacaan dan jarak antarelemen agar navigasi tetap nyaman pada berbagai ukuran layar.
8) Pemeriksaan Konsistensi dan Akses
- Memastikan halaman yang memerlukan status masuk (misalnya tambah, edit, hapus) benar-benar terlindungi dan mengarah ke halaman login bila pengguna belum autentikasi.
- Memeriksa kembali tampilan pada ponsel, tablet, dan desktop melalui peranti pengembang di peramban.
- Menguji alur lengkap: masuk → tambah produk → lihat detail → edit → hapus → keluar.