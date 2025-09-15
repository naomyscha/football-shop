"""
ASGI config for shop project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

# Tentukan setting default project yang dipakai oleh Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shop.settings')

# Buat instance aplikasi ASGI untuk project ini
application = get_asgi_application()
