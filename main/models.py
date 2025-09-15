from django.db import models

# Model Product untuk menyimpan data produk di database
class Product(models.Model):
    name = models.CharField(max_length=120)          # Nama produk (wajib)
    price = models.IntegerField()                    # Harga produk (wajib)
    description = models.TextField()                 # Deskripsi produk (wajib)
    thumbnail = models.URLField(help_text="URL gambar produk")  # Gambar produk (URL)
    category = models.CharField(max_length=60)       # Kategori produk (wajib)
    is_featured = models.BooleanField(default=False) # Status unggulan (default False)

    # Optional field yang bisa dipakai nanti
    # stock = models.IntegerField(default=0, blank=True)
    # brand = models.CharField(max_length=60, blank=True)

    def __str__(self):
        # Menampilkan nama produk saat di-print/lihat di admin
        return self.name
