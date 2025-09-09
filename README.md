# Football Shop — Tugas 2 PBP
Link PWS: [https://<username-SSO>-footballshop.pbp.cs.ui.ac.id/](https://naomyscha-attalie-footballshop.pbp.cs.ui.ac.id/)

## Step-by-Step Inisiasi Proyek Django
Saya membuat direktori baru dengan nama FootballShop. Lalu membuat file requirements.txt yang berisi django, gunicorn, whitenoise, psycopg2-binary, requests, dan urllib3. Setelah itu saya menjalankan virtual environment, install dependencies dengan perintah pip install -r requirements.txt, dan membuat proyek Django dengan perintah django-admin startproject shop .

Menjalankan Server
Di settings.py saya menambahkan ALLOWED_HOSTS = ["localhost", "127.0.0.1"]. Setelah itu saya menjalankan server dengan perintah python manage.py runserver.

Membuat Aplikasi main
Saya membuat aplikasi baru bernama main dengan perintah python manage.py startapp main. Lalu saya menambahkan "main" ke dalam INSTALLED_APPS di settings.py.

Membuat Model
Di main/models.py saya membuat model Product dengan atribut name (CharField), price (IntegerField), description (TextField), thumbnail (URLField), category (CharField), dan is_featured (BooleanField). Setelah itu saya menjalankan python manage.py makemigrations dan python manage.py migrate agar tabel terbentuk di database.

Membuat View dan Template
Di main/views.py saya membuat fungsi home yang mengembalikan context berisi app_name, student_name, student_class, dan daftar produk dari Product.objects.all(). Fungsi ini me-render template main.html yang menampilkan nama aplikasi, nama, kelas, serta daftar produk.

Routing
Di shop/urls.py saya mengarahkan path '' ke main.urls. Lalu di main/urls.py saya menambahkan path '' ke fungsi home. Dengan begitu halaman utama bisa diakses.

Deployment ke PWS
Saya push repository ke GitHub, hubungkan dengan PWS, lalu set environment variables untuk database PostgreSQL. Setelah itu saya menjalankan python manage.py migrate dan python manage.py collectstatic --noinput di PWS. Aplikasi akhirnya bisa diakses di http://naomyscha-attalie-footballshop.pbp.cs.ui.ac.id/

## Bagan Alur (MVT)
![rooting](https://github.com/user-attachments/assets/c27121f3-b67c-4213-a878-7c192a611976)

## Peran settings.py
settings.py adalah pusat konfigurasi proyek Django. Semua pengaturan inti ada di sini, mulai dari daftar aplikasi yang dipakai (INSTALLED\_APPS), koneksi ke database, lokasi file template dan file statis, middleware, sampai pengaturan keamanan seperti SECRET\_KEY, DEBUG, dan ALLOWED\_HOSTS. File ini juga menyimpan pengaturan bahasa, timezone, serta konfigurasi tambahan lain. Tanpa settings.py, Django tidak tahu bagaimana cara menjalankan proyek, sehingga bisa dibilang file ini adalah jantung aplikasi Django.

## Cara migrasi Database di Django
migrasi database di Django bekerja dengan cara mencatat perubahan struktur model Python ke dalam file migrasi, lalu menerapkannya ke database. Pertama, saat kita menambah atau mengubah field pada models.py, Django tidak langsung mengubah tabel di database. Kita harus menjalankan perintah python manage.py makemigrations untuk membuat file migrasi yang berisi instruksi perubahan. Setelah itu, perintah python manage.py migrate mengeksekusi instruksi tersebut ke database sehingga tabel dan kolom benar-benar berubah sesuai model. Dengan sistem ini, pengembang bisa menjaga konsistensi kode dan database serta melacak riwayat perubahan.

## Alasan Django beginner-friendly
Django sering dipilih sebagai framework pertama untuk belajar karena sifatnya lengkap dan ramah pemula. Django sudah menyediakan banyak fitur bawaan (batteries included) seperti ORM untuk database, sistem template, autentikasi, dan pengaturan keamanan, jadi pemula tidak perlu menambahkan modul tambahan hanya untuk fitur dasar. Selain itu, Django menggunakan bahasa Python yang sintaksnya sederhana dan mudah dibaca, sehingga memudahkan mahasiswa atau pengembang baru memahami logika program. Struktur proyeknya juga rapi dan mendorong praktik terbaik (seperti pemisahan model, view, dan template). Hal-hal ini membuat Django jadi pilihan ideal untuk belajar dasar pengembangan aplikasi web sebelum beralih ke framework lain yang lebih kompleks.

# Feedback Asdos
Ka Fahri adalah asdos yang sangat helpful! Beliau selalu responsif dan sangat membantu, terutama selama saya menjalani masa dispensasi. Berkat bimbingan Ka Fahri, saya tidak merasa ada gap knowledge sama sekali dan tetap bisa mengikuti materi dengan baik.
