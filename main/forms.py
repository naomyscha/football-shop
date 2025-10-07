from django import forms
from django.utils.html import strip_tags

from .models import Product


class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ["name", "price", "description", "thumbnail", "category", "is_featured"]
        widgets = {
            "description": forms.Textarea(attrs={"rows": 4}),
        }

    def clean_name(self):
        value = self.cleaned_data.get("name", "")
        return strip_tags(value).strip()

    def clean_description(self):
        value = self.cleaned_data.get("description", "")
        return strip_tags(value).strip()

    def clean_category(self):
        value = self.cleaned_data.get("category", "")
        return strip_tags(value).strip()
