from django.shortcuts import render
from .models import Product

# Fungsi view untuk menampilkan halaman utama
def home(request):
    # Contoh query: ambil semua produk dari database
    # dan urutkan berdasarkan featured lalu nama
    # products = Product.objects.all().order_by("-is_featured", "name")

    # Context = data yang akan dikirim ke template
    context = {
        "app_name": "Myscha's Soccerella ⚽️",
        "student_name": "Naomyscha Attalie Maza",
        "student_class": "PBP F",
        # "products": products,   # Jika query dipakai, data produk dikirim ke template
    }

    # Render template main.html dengan data context
    return render(request, "main.html", context)
