# Football Shop — Tugas 3 PBP
Link PWS: https://naomyscha-attalie-footballshop.pbp.cs.ui.ac.id/

## Mengapa kita memerlukan Data Delivery
Data delivery penting karena memungkinkan backend menyajikan data dalam format yang bisa diakses oleh berbagai jenis klien, tidak hanya HTML untuk browser. Dengan adanya data delivery (misalnya dalam bentuk XML atau JSON), aplikasi mobile, website, maupun layanan pihak ketiga bisa menggunakan data yang sama. Hal ini membuat platform lebih fleksibel, interoperabel, dan mudah diintegrasikan. Data delivery juga memudahkan pengujian menggunakan Postman atau cURL, serta membuat sistem lebih skalabel karena satu sumber data bisa diakses oleh banyak client.

## XML vs JSON
XML dan JSON sama-sama bisa digunakan untuk pertukaran data, tetapi JSON lebih sering dipakai dalam API modern. JSON lebih ringkas, lebih mudah dibaca oleh manusia, parsing-nya lebih cepat, dan secara default didukung oleh JavaScript maupun bahasa pemrograman lain. XML masih berguna ketika dibutuhkan skema atau struktur data kompleks dengan atribut dan namespace, tetapi cenderung lebih verbose. Karena alasan kepraktisan dan efisiensi, JSON lebih populer dibandingkan XML untuk kebutuhan web development sehari-hari.

## Fungsi is_valid() pada Form Django
Method is_valid() digunakan untuk melakukan validasi data pada form Django. Fungsi ini mengecek apakah semua field form sesuai dengan aturan yang sudah didefinisikan di model atau form (misalnya tipe data, field wajib, panjang maksimal). Jika valid, maka data akan tersedia dalam form.cleaned_data dan siap disimpan ke database. Jika tidak valid, maka error akan muncul di form.errors. Validasi server-side ini sangat penting untuk menjaga konsistensi data dan mencegah input berbahaya yang bisa merusak sistem.

## Pentingnya csrf_token pada Form
csrf_token adalah token keamanan yang melindungi aplikasi dari serangan Cross-Site Request Forgery (CSRF). Token ini memastikan bahwa request POST yang masuk benar-benar berasal dari form di aplikasi kita, bukan dari situs luar yang mencoba menyalahgunakan session user. Jika kita tidak menambahkan csrf_token, penyerang bisa membuat form di situs mereka yang diam-diam mengirim request ke server kita dengan menggunakan cookie login korban, sehingga bisa mengubah data tanpa sepengetahuan user. Dengan adanya token unik yang dicek setiap request, Django menolak request palsu dan mencegah serangan CSRF.

## Step-by-Step Implementasi Tugas 3
**Menambahkan Data Delivery Views**
Saya menambahkan empat fungsi baru di `main/views.py` untuk mengembalikan data dalam format XML dan JSON. Fungsi `show_xml` dan `show_json` mengembalikan semua data `Product` menggunakan `serializers.serialize`. Sedangkan `show_xml_by_id` dan `show_json_by_id` mengembalikan data berdasarkan `id` tertentu dengan filter `pk=id`.
**Routing**
Di `main/urls.py` saya menambahkan path berikut:
* `path("xml/", show_xml, name="show_xml")`
* `path("json/", show_json, name="show_json")`
* `path("xml/<int:id>/", show_xml_by_id, name="show_xml_by_id")`
* `path("json/<int:id>/", show_json_by_id, name="show_json_by_id")`
Dengan begitu, saya bisa mengakses data dalam berbagai format di URL `/xml/`, `/json/`, `/xml/<id>/`, dan `/json/<id>/`.
**Membuat Dashboard Produk**
Saya memperbarui fungsi `home()` di `main/views.py` untuk mengambil semua objek `Product` dan merender `main.html`. Di dalam `main.html`, produk ditampilkan dalam bentuk grid card. Setiap card menampilkan nama, kategori, harga, dan memiliki tombol **Detail**. Saya juga menambahkan tombol **+ Add Product** di header, serta tombol **XML** dan **JSON** agar mudah mengakses endpoint data delivery.
**Form Tambah Produk**
Saya membuat `ProductForm` berbasis `ModelForm` di `main/forms.py`. Kemudian menambahkan view `add_product()` yang menangani GET dan POST:
* Jika GET → render form kosong.
* Jika POST dan `form.is_valid()` → simpan produk baru, lalu redirect ke halaman utama dengan pesan sukses.
Form ini dirender di template `add_product.html` menggunakan `{{ form.as_p }}` dan `{% csrf_token %}`.
**Halaman Detail Produk**
Saya menambahkan view `product_detail()` yang mengambil satu produk berdasarkan `id` menggunakan `get_object_or_404`. View ini merender `detail.html` yang menampilkan informasi lengkap produk seperti nama, harga, kategori, deskripsi, dan gambar.
**Uji Coba dengan Postman**
Saya menguji keempat URL data delivery (`/xml/`, `/json/`, `/xml/<id>/`, `/json/<id>/`) menggunakan Postman, lalu mengambil screenshot hasil respons dan menambahkannya ke README.
**Deployment ke PWS**
Saya memastikan `ALLOWED_HOSTS` dan `CSRF_TRUSTED_ORIGINS` sudah berisi domain PWS saya. Setelah itu, saya melakukan `git add .`, `git commit`, dan `git push pws master`. Kemudian saya menjalankan `python manage.py migrate` dan `python manage.py collectstatic --noinput` di PWS. Aplikasi berhasil dideploy dan dapat diakses di [https://naomyscha-attalie-footballshop.pbp.cs.ui.ac.id/](https://naomyscha-attalie-footballshop.pbp.cs.ui.ac.id/).

## Feedback Asdos
Ka Fahri di tutorial 2 menurut saya sangat jelas dalam menjelaskan materi dan sabar ketika menjawab pertanyaan. Penjelasannya runtut sehingga mudah dipahami, bahkan untuk saya yang sempat tertinggal karena ada dispensasi. Selain itu, Ka Fahri juga responsif ketika ada kendala teknis, sehingga saya bisa tetap mengikuti progres tugas dengan baik. Terima kasih banyak atas bimbingannya Kak! 🙏

## Uji Coba Data Delivery dengan Postman
<img width="1461" height="826" alt="Screenshot 2025-09-16 at 09 27 06" src="https://github.com/user-attachments/assets/f93b72b3-ce83-4deb-a593-f4457514d0c9" />
<img width="1462" height="836" alt="Screenshot 2025-09-16 at 09 27 24" src="https://github.com/user-attachments/assets/e6cc2665-1ede-401f-a776-bf0e30425c2e" />
<img width="1467" height="836" alt="Screenshot 2025-09-16 at 09 30 45" src="https://github.com/user-attachments/assets/818d846a-d0be-48fa-86da-701b1c3c2d7c" />
<img width="1466" height="836" alt="Screenshot 2025-09-16 at 09 30 58" src="https://github.com/user-attachments/assets/611bb843-fcec-412d-bec1-9bcafb3262ed" />
