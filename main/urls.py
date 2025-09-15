from django.urls import path
from .views import (
    home,              # sudah ada
    show_xml, show_json,
    show_xml_by_id, show_json_by_id,
    add_product, product_detail
)

# Namespace untuk aplikasi 'main'
app_name = "main"

# Routing khusus untuk aplikasi 'main'
# URL "" (root) diarahkan ke fungsi home di views.py
urlpatterns = [
    path("", home, name="home"),
    # data delivery
    path("xml/", show_xml, name="show_xml"),
    path("json/", show_json, name="show_json"),
    path("xml/<int:id>/", show_xml_by_id, name="show_xml_by_id"),
    path("json/<int:id>/", show_json_by_id, name="show_json_by_id"),
    # form & detail
    path("add/", add_product, name="add_product"),
    path("product/<int:id>/", product_detail, name="product_detail"),
]
