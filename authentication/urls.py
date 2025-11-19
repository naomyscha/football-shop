# authentication/urls.py
from django.urls import path
from authentication.views import login, register, logout # Import semua view

app_name = 'authentication'

urlpatterns = [
    path('login/', login, name='login'),
    path('register/', register, name='register'), # Path untuk registrasi
    path('logout/', logout, name='logout'),     # Path untuk logout
]