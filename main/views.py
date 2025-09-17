from django.http import HttpResponse, HttpResponseNotFound  # Import response HTTP standar Django
from django.core import serializers                        # Import serializer untuk XML/JSON
from .models import Product                                # Import model Product
from django.shortcuts import render, redirect, get_object_or_404  # Import fungsi shortcut Django
from django.contrib import messages                        # Import modul pesan Django
from .forms import ProductForm                             # Import form ProductForm
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
import datetime
from django.http import HttpResponseRedirect
from django.urls import reverse

# Fungsi view untuk menampilkan halaman utama
@login_required(login_url='/login')
def home(request):
    # Query semua produk, urutkan featured dulu lalu nama
    products = Product.objects.all().order_by("-is_featured", "name")

    # Context = data yang dikirim ke template
    context = {
        "app_name": "Myscha's Soccerella ⚽️",         # Nama aplikasi
        "student_name": "Naomyscha Attalie Maza",      # Nama mahasiswa
        "student_class": "PBP F",                      # Kelas mahasiswa
        "products": products,                          # Daftar produk
        'last_login': request.COOKIES.get('last_login', 'Never'),
        "username": request.user.username,
    }

    # Render template main.html dengan context
    return render(request, "main.html", context)

# Fungsi view untuk menambah produk baru
@login_required(login_url="/login/")
def add_product(request):
    if request.method == "POST":
        form = ProductForm(request.POST)
        if form.is_valid():
            obj = form.save(commit=False)  # isi user sebelum simpan
            obj.user = request.user
            obj.save()
            messages.success(request, "Product added.")
            return redirect("main:home")
        messages.error(request, "Form invalid.")
    else:
        form = ProductForm()
    return render(request, "add_product.html", {"form": form})

# Fungsi view untuk detail produk
@login_required(login_url="/login/")
def product_detail(request, id):
    product = get_object_or_404(Product, pk=id, user=request.user)  # hanya boleh akses milik sendiri
    return render(request, "detail.html", {"product": product})

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
    
def register(request):
    form = UserCreationForm()
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Your account has been successfully created!")
            return HttpResponseRedirect(reverse("main:login"))
    return render(request, "register.html", {"form": form})


def login_user(request):
    if request.method == "POST":
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            resp = HttpResponseRedirect(reverse("main:home"))
            resp.set_cookie("last_login", str(datetime.datetime.now()))
            return resp
    else:
        form = AuthenticationForm(request)
    return render(request, "login.html", {"form": form})


def logout_user(request):
    logout(request)
    response = HttpResponseRedirect(reverse('main:login'))
    response.delete_cookie('last_login')
    return response