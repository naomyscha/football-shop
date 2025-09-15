from django.http import HttpResponse, HttpResponseNotFound
from django.core import serializers
from .models import Product
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .forms import ProductForm

# Fungsi view untuk menampilkan halaman utama
def home(request):
    # Contoh query: ambil semua produk dari database
    # dan urutkan berdasarkan featured lalu nama
    products = Product.objects.all().order_by("-is_featured", "name")

    # Context = data yang akan dikirim ke template
    context = {
        "app_name": "Myscha's Soccerella ⚽️",
        "student_name": "Naomyscha Attalie Maza",
        "student_class": "PBP F",
        "products": products,   # Jika query dipakai, data produk dikirim ke template
    }

    # Render template main.html dengan data context
    return render(request, "main.html", context)

def add_product(request):
    if request.method == "POST":
        form = ProductForm(request.POST)
        # is_valid() memicu built-in validation dari Django form & model
        if form.is_valid():
            form.save()
            messages.success(request, "Produk berhasil ditambahkan.")
            return redirect("main:home")
        messages.error(request, "Form tidak valid. Coba cek kembali.")
    else:
        form = ProductForm()
    return render(request, "add_product.html", {"form": form})

def product_detail(request, id):
    product = get_object_or_404(Product, pk=id)
    return render(request, "detail.html", {"product": product})

def show_xml(request):
    data = Product.objects.all()
    return HttpResponse(serializers.serialize("xml", data), content_type="application/xml")

def show_json(request):
    data = Product.objects.all()
    return HttpResponse(serializers.serialize("json", data), content_type="application/json")

def show_xml_by_id(request, id):
    try:
        data = Product.objects.filter(pk=id)
        if not data.exists():
            return HttpResponseNotFound("<error>Not Found</error>")
        return HttpResponse(serializers.serialize("xml", data), content_type="application/xml")
    except Product.DoesNotExist:
        return HttpResponseNotFound("<error>Not Found</error>")

def show_json_by_id(request, id):
    try:
        data = Product.objects.filter(pk=id)
        if not data.exists():
            return HttpResponseNotFound('{"detail":"Not Found"}', content_type="application/json")
        return HttpResponse(serializers.serialize("json", data), content_type="application/json")
    except Product.DoesNotExist:
        return HttpResponseNotFound('{"detail":"Not Found"}', content_type="application/json")