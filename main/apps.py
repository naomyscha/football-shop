from django.apps import AppConfig

# Konfigurasi untuk aplikasi 'main'
class MainConfig(AppConfig):
    # ID default untuk field primary key
    default_auto_field = 'django.db.models.BigAutoField'
    # Nama aplikasi
    name = 'main'
