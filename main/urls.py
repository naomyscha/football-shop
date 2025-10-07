from django.urls import path

from .views import (
    add_product,
    delete_product,
    edit_product,
    home,
    login_api,
    login_user,
    logout_api,
    logout_user,
    product_create_ajax,
    product_delete_ajax,
    product_detail,
    product_detail_ajax,
    product_update_ajax,
    products_json,
    register,
    register_api,
    show_json,
    show_json_by_id,
    show_xml,
    show_xml_by_id,
)

app_name = "main"

urlpatterns = [
    path("", home, name="home"),
    # Product API endpoints
    path("products/json/", products_json, name="products_json"),
    path("products/ajax/create/", product_create_ajax, name="product_create_ajax"),
    path("products/ajax/update/<int:id>/", product_update_ajax, name="product_update_ajax"),
    path("products/ajax/delete/<int:id>/", product_delete_ajax, name="product_delete_ajax"),
    path("products/ajax/detail/<int:id>/", product_detail_ajax, name="product_detail_ajax"),
    # Legacy XML/JSON
    path("xml/", show_xml, name="show_xml"),
    path("json/", show_json, name="show_json"),
    path("xml/<int:id>/", show_xml_by_id, name="show_xml_by_id"),
    path("json/<int:id>/", show_json_by_id, name="show_json_by_id"),
    # Page views
    path("add/", add_product, name="add_product"),
    path("product/<int:id>/", product_detail, name="product_detail"),
    path("product/<int:id>/edit/", edit_product, name="edit_product"),
    path("product/<int:id>/delete/", delete_product, name="delete_product"),
    # Auth views
    path("register/", register, name="register"),
    path("login/", login_user, name="login"),
    path("logout/", logout_user, name="logout"),
    # Auth API
    path("api/auth/register/", register_api, name="register_api"),
    path("api/auth/login/", login_api, name="login_api"),
    path("api/auth/logout/", logout_api, name="logout_api"),
]
