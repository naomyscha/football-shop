import datetime
import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.core import serializers
from django.http import (
    HttpResponse,
    HttpResponseNotFound,
    HttpResponseRedirect,
    JsonResponse,
)
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import (
    require_GET,
    require_http_methods,
    require_POST,
)
from django.utils.html import strip_tags

from .forms import ProductForm
from .models import Product


def _product_to_dict(product, user=None):
    """Standard product serializer for JSON responses."""
    owner = product.user
    return {
        "id": product.id,
        "name": product.name,
        "price": product.price,
        "description": product.description,
        "thumbnail": product.thumbnail,
        "category": product.category,
        "is_featured": product.is_featured,
        "owner": owner.username if owner else None,
        "owner_id": owner.id if owner else None,
        "is_owner": bool(user and owner and owner.id == user.id),
    }


# =========================
# HOME (AJAX first)
# =========================
@login_required(login_url="/login/")
@ensure_csrf_cookie
def home(request):
    context = {
        "app_name": "Myscha's Soccerella ⚽️",
        "student_name": "Naomyscha Attalie Maza",
        "student_class": "PBP F",
        "last_login": request.COOKIES.get("last_login", "Never"),
        "username": request.user.username,
    }
    return render(request, "main.html", context)


# =========================
# PRODUCT API
# =========================
def _sanitize_payload(body):
    """Return cleaned dict ready for ProductForm."""
    return {
        "name": strip_tags((body.get("name") or "").strip()),
        "price": body.get("price"),
        "description": strip_tags((body.get("description") or "").strip()),
        "thumbnail": (body.get("thumbnail") or "").strip(),
        "category": strip_tags((body.get("category") or "").strip()),
        "is_featured": body.get("is_featured"),
    }


@login_required(login_url="/login/")
@require_GET
def products_json(request):
    filt = (request.GET.get("filter") or "all").lower()
    products = Product.objects.all().order_by("-is_featured", "name")
    if filt == "mine":
        products = products.filter(user=request.user)
    elif filt == "expensive":
        products = products.filter(price__gte=500_000).order_by("-price")

    payload = [_product_to_dict(prod, request.user) for prod in products]
    return JsonResponse({"products": payload})


@login_required(login_url="/login/")
@require_POST
def product_create_ajax(request):
    try:
        body = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"errors": {"__all__": ["Invalid JSON payload."]}}, status=400)

    clean = _sanitize_payload(body)
    form_data = {
        "name": clean["name"],
        "price": clean["price"],
        "description": clean["description"],
        "thumbnail": clean["thumbnail"],
        "category": clean["category"],
        "is_featured": "on" if clean["is_featured"] else "",
    }
    form = ProductForm(form_data)
    if form.is_valid():
        product = form.save(commit=False)
        product.user = request.user
        product.save()
        return JsonResponse(
            {
                "message": "Nice! Your product is live.",
                "product": _product_to_dict(product, request.user),
            },
            status=201,
        )
    return JsonResponse({"errors": form.errors}, status=400)


@login_required(login_url="/login/")
@require_POST
def product_update_ajax(request, id):
    product = get_object_or_404(Product, pk=id, user=request.user)
    try:
        body = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"errors": {"__all__": ["Invalid JSON payload."]}}, status=400)

    clean = _sanitize_payload(body)
    form_data = {
        "name": clean["name"],
        "price": clean["price"],
        "description": clean["description"],
        "thumbnail": clean["thumbnail"],
        "category": clean["category"],
        "is_featured": "on" if clean["is_featured"] else "",
    }
    form = ProductForm(form_data, instance=product)
    if form.is_valid():
        product = form.save()
        return JsonResponse(
            {
                "message": "Product updated.",
                "product": _product_to_dict(product, request.user),
            }
        )
    return JsonResponse({"errors": form.errors}, status=400)


@login_required(login_url="/login/")
@require_http_methods(["POST", "DELETE"])
def product_delete_ajax(request, id):
    product = get_object_or_404(Product, pk=id, user=request.user)
    product.delete()
    return JsonResponse({"message": "Product removed."})


@login_required(login_url="/login/")
@require_GET
def product_detail_ajax(request, id):
    product = get_object_or_404(Product, pk=id)
    return JsonResponse({"product": _product_to_dict(product, request.user)})


# =========================
# DETAIL / EDIT TEMPLATES (AJAX driven)
# =========================
@login_required(login_url="/login/")
def product_detail(request, id):
    get_object_or_404(Product, pk=id)  # ensure 404 jika tidak ada
    return render(request, "detail.html", {"product_id": id})


@login_required(login_url="/login/")
@ensure_csrf_cookie
def add_product(request):
    return render(request, "add_product.html")


@login_required(login_url="/login/")
@ensure_csrf_cookie
def edit_product(request, id):
    get_object_or_404(Product, pk=id, user=request.user)
    return render(request, "edit_product.html", {"product_id": id})


@login_required(login_url="/login/")
def delete_product(request, id):
    # Legacy fallback: gunakan API untuk delete, lalu redirect
    product = get_object_or_404(Product, pk=id, user=request.user)
    product.delete()
    return redirect("main:home")


# =========================
# XML / JSON (legacy)
# =========================
def show_xml(request):
    data = Product.objects.all()
    return HttpResponse(serializers.serialize("xml", data), content_type="application/xml")


def show_json(request):
    data = Product.objects.all()
    return HttpResponse(serializers.serialize("json", data), content_type="application/json")


def show_xml_by_id(request, id):
    data = Product.objects.filter(pk=id)
    if not data.exists():
        return HttpResponseNotFound("<error>Not Found</error>", content_type="application/xml")
    return HttpResponse(serializers.serialize("xml", data), content_type="application/xml")


def show_json_by_id(request, id):
    data = Product.objects.filter(pk=id)
    if not data.exists():
        return HttpResponseNotFound('{"detail":"Not Found"}', content_type="application/json")
    return HttpResponse(serializers.serialize("json", data), content_type="application/json")


# =========================
# AUTH
# =========================
@ensure_csrf_cookie
def register(request):
    return render(request, "register.html")


@require_http_methods(["POST"])
@ensure_csrf_cookie
def register_api(request):
    try:
        body = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"errors": {"__all__": ["Invalid JSON payload."]}}, status=400)

    form_data = {
        "username": body.get("username"),
        "password1": body.get("password1"),
        "password2": body.get("password2"),
    }
    form = UserCreationForm(form_data)
    if form.is_valid():
        user = form.save()
        return JsonResponse(
            {
                "message": "Account created.",
                "redirect": reverse("main:login"),
                "username": user.username,
            },
            status=201,
        )
    return JsonResponse({"errors": form.errors}, status=400)


@ensure_csrf_cookie
def login_user(request):
    return render(request, "login.html")


@require_http_methods(["POST"])
@ensure_csrf_cookie
def login_api(request):
    try:
        body = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"errors": {"__all__": ["Invalid JSON payload."]}}, status=400)

    username = body.get("username")
    password = body.get("password")
    user = authenticate(username=username, password=password)

    if user:
        login(request, user)
        response = JsonResponse(
            {
                "message": "Login successful.",
                "redirect": reverse("main:home"),
                "username": user.username,
            }
        )
        response.set_cookie("last_login", str(datetime.datetime.now()))
        return response

    return JsonResponse(
        {"errors": {"__all__": ["Invalid username or password."]}},
        status=400,
    )


@login_required(login_url="/login/")
@require_POST
def logout_api(request):
    logout(request)
    response = JsonResponse(
        {
            "message": "You are signed out.",
            "redirect": reverse("main:login"),
        }
    )
    response.delete_cookie("last_login")
    return response


def logout_user(request):
    logout(request)
    redirect_url = f"{reverse('main:login')}?logged_out=1"
    response = HttpResponseRedirect(redirect_url)
    response.delete_cookie("last_login")
    return response
