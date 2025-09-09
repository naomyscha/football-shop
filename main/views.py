from django.shortcuts import render
from .models import Product

def home(request):
    products = Product.objects.all().order_by("-is_featured", "name")
    context = {
        "app_name": "Football Shop",
        "student_name": "Naomyscha Attalie Maza",
        "student_class": "PBP F",
        "products": products,
    }
    return render(request, "main.html", context)
