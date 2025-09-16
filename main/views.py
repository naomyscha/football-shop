from django.http import HttpResponse, HttpResponseNotFound  # Import response HTTP standar Django
from django.core import serializers                        # Import serializer untuk XML/JSON
from .models import Product                                # Import model Product
from django.shortcuts import render, redirect, get_object_or_404  # Import fungsi shortcut Django
from django.contrib import messages                        # Import modul pesan Django
from .forms import ProductForm                             # Import form ProductForm

# Fungsi view untuk menampilkan halaman utama
def home(request):
    # Query semua produk, urutkan featured dulu lalu nama
    products = Product.objects.all().order_by("-is_featured", "name")

    # Context = data yang dikirim ke template
    context = {
        "app_name": "Myscha's Soccerella ⚽️",         # Nama aplikasi
        "student_name": "Naomyscha Attalie Maza",      # Nama mahasiswa
        "student_class": "PBP F",                      # Kelas mahasiswa
        "products": products,                          # Daftar produk
    }

    # Render template main.html dengan context
    return render(request, "main.html", context)

# Fungsi view untuk menambah produk baru
def add_product(request):
    if request.method == "POST":                       # Jika request POST (submit form)
        form = ProductForm(request.POST)               # Buat form dari data POST
        if form.is_valid():                            # Validasi form
            form.save()                                # Simpan ke database
            messages.success(request, "Produk berhasil ditambahkan.")  # Pesan sukses
            return redirect("main:home")               # Redirect ke halaman utama
        messages.error(request, "Form tidak valid. Coba cek kembali.") # Pesan error
    else:
        form = ProductForm()                           # Jika GET, buat form kosong
    return render(request, "add_product.html", {"form": form}) # Render form

# Fungsi view untuk detail produk
def product_detail(request, id):
    product = get_object_or_404(Product, pk=id)        # Ambil produk berdasarkan id, 404 jika tidak ada
    return render(request, "detail.html", {"product": product}) # Render detail produk

# Fungsi view untuk menampilkan semua produk dalam format XML
def show_xml(request):
    data = Product.objects.all()                       # Query semua produk
    return HttpResponse(serializers.serialize("xml", data), content_type="application/xml") # Return XML

# Fungsi view untuk menampilkan semua produk dalam format JSON
def show_json(request):
    data = Product.objects.all()                       # Query semua produk
    return HttpResponse(serializers.serialize("json", data), content_type="application/json") # Return JSON

# Fungsi view untuk menampilkan produk tertentu (by id) dalam format XML
def show_xml_by_id(request, id):
    try:
        data = Product.objects.filter(pk=id)           # Query produk dengan id tertentu
        if not data.exists():                          # Jika tidak ada data
            return HttpResponseNotFound("<error>Not Found</error>") # Return error XML
        return HttpResponse(serializers.serialize("xml", data), content_type="application/xml") # Return XML
    except Product.DoesNotExist:                       # Jika produk tidak ditemukan
        return HttpResponseNotFound("<error>Not Found</error>") # Return error XML

# Fungsi view untuk menampilkan produk tertentu (by id) dalam format JSON
def show_json_by_id(request, id):
    try:
        data = Product.objects.filter(pk=id)           # Query produk dengan id tertentu
        if not data.exists():                          # Jika tidak ada data
            return HttpResponseNotFound('{"detail":"Not Found"}', content_type="application/json") # Return error JSON
        return HttpResponse(serializers.serialize("json", data), content_type="application/json") # Return JSON
    except Product.DoesNotExist:                       # Jika produk tidak ditemukan
        return HttpResponseNotFound('{"detail":"Not Found"}', content_type="application/json") # Return error JSON