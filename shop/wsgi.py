"""
WSGI config for shop project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

# Tentukan setting default project yang dipakai oleh Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shop.settings')

# Buat instance aplikasi WSGI untuk project ini
application = get_wsgi_application()
