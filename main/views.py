from django.shortcuts import render
from .models import Product

def home(request):
    # products = Product.objects.all().order_by("-is_featured", "name") # <-- QUERY DB
    context = {
        "app_name": "Football Shop",
        "student_name": "Naomyscha Attalie Maza",
        "student_class": "PBP F",
        # "products": products,   # <-- kirim ke template
    }
    return render(request, "main.html", context)
