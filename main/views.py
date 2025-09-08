from django.shortcuts import render

def home(request):
    context = {
        "app_name": "Football Shop",
        "student_name": "Naomyscha Attalie Maza",  # ganti namamu
        "student_class": "PBP F",                  # ganti kelasmu
    }
    return render(request, "main.html", context)