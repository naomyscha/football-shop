from django.urls import path
from .views import home

# Namespace untuk aplikasi 'main'
app_name = "main"

# Routing khusus untuk aplikasi 'main'
# URL "" (root) diarahkan ke fungsi home di views.py
urlpatterns = [
    path("", home, name="home"),
]
