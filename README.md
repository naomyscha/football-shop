# Football Shop — Tugas 2 PBP

**Link PWS**: [https://<username-SSO>-footballshop.pbp.cs.ui.ac.id/](https://naomyscha-attalie-footballshop.pbp.cs.ui.ac.id/)

## Implementasi Step-by-step
1) Buat proyek baru `football-shop`, venv, `requirements.txt`.
2) `django-admin startproject shop .`
3) `python3 manage.py startapp main` lalu daftarkan di `INSTALLED_APPS`.
4) Buat model `Product` (name, price, description, thumbnail, category, is_featured). `makemigrations` + `migrate`.
5) Buat view `home` (tampilkan nama app + nama + kelas).
6) Template `main/templates/main/index.html`.
7) Routing: `main/urls.py` → include di `shop/urls.py`.
8) `.env` (PRODUCTION=False), konfigurasi DB switch di `settings.py`.
9) Push ke GitHub, siapkan Environs di PWS, tambah domain ke `ALLOWED_HOSTS`, deploy `git push pws master`.

## Bagan Alur (MVT)
```mermaid
sequenceDiagram
    participant C as Client (Browser)
    participant U as urls.py (project)
    participant MU as main/urls.py
    participant V as views.py (home)
    participant M as models.py (Product)
    participant T as templates/main/index.html

    C->>U: GET /
    U->>MU: include("main.urls")
    MU->>V: panggil home()
    V-->>M: (opsional) query data Product
    V-->>T: render(template, context)
    T-->>C: HTML response
