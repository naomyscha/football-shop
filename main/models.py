from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=120)          # wajib
    price = models.IntegerField()                    # wajib
    description = models.TextField()                 # wajib
    thumbnail = models.URLField()                    # wajib (URL gambar)
    category = models.CharField(max_length=60)       # wajib
    is_featured = models.BooleanField(default=False) # wajib

    # contoh tambahan (opsional):
    stock = models.IntegerField(default=0, blank=True)
    brand = models.CharField(max_length=60, blank=True)

    def __str__(self):
        return self.name