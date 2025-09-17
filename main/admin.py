from django.contrib import admin
from .models import Product

# Registrasi model Product ke admin site Django
# Supaya data Product bisa dikelola lewat halaman admin
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    # Kolom yang ditampilkan di list view admin
    list_display = ("id", "name", "price", "category", "is_featured", "user")
    # Tambah filter berdasarkan kategori & status featured
    list_filter = ("category", "is_featured")
    # Aktifkan pencarian berdasarkan nama dan kategori
    search_fields = ("name", "category", "user__username")
