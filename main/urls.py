from django.urls import path  # Import path untuk routing
from .views import (          # Import semua view yang digunakan
    home,                     # Halaman utama
    show_xml, show_json,      # Data produk dalam XML/JSON
    show_xml_by_id, show_json_by_id, # Data produk by id dalam XML/JSON
    add_product, product_detail # Form tambah & detail produk
)

app_name = "main"             # Namespace aplikasi

# Daftar URL routing aplikasi main
urlpatterns = [
    path("", home, name="home"),                         # Halaman utama
    path("xml/", show_xml, name="show_xml"),             # Semua produk XML
    path("json/", show_json, name="show_json"),          # Semua produk JSON
    path("xml/<int:id>/", show_xml_by_id, name="show_xml_by_id"),   # Produk by id XML
    path("json/<int:id>/", show_json_by_id, name="show_json_by_id"), # Produk by id JSON
    path("add/", add_product, name="add_product"),       # Form tambah produk
    path("product/<int:id>/", product_detail, name="product_detail"), # Detail produk
]
