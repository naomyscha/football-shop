from django import forms                # Import modul forms dari Django
from .models import Product             # Import model Product

class ProductForm(forms.ModelForm):     # Form untuk model Product
    class Meta:
        model = Product                 # Model yang digunakan
        fields = ["name", "price", "description", "thumbnail", "category", "is_featured"] # Field yang ditampilkan
        widgets = {
            "description": forms.Textarea(attrs={"rows": 4}), # Widget textarea untuk deskripsi
        }
