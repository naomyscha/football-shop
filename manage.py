#!/usr/bin/env python           # Shebang untuk menjalankan file dengan Python interpreter
"""Django's command-line utility for administrative tasks."""  # Deskripsi singkat file

import os                       # Import modul os untuk operasi sistem
import sys                      # Import modul sys untuk akses ke argumen command line


def main():
    """Run administrative tasks."""    # Fungsi utama untuk menjalankan tugas administratif Django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shop.settings')  # Set environment variable untuk settings Django
    try:
        from django.core.management import execute_from_command_line  # Import fungsi eksekusi command line Django
    except ImportError as exc:   # Tangkap error jika Django belum terinstall
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "  # Pesan error jika Django tidak ditemukan
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)   # Jalankan perintah dari command line


if __name__ == '__main__':       # Jika file dijalankan langsung
    main()                       # Panggil fungsi main
