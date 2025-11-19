# authentication/views.py
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# --- VIEW LOGIN ---
@csrf_exempt
def login(request):
    # Menggunakan request.POST karena Flutter menggunakan request.login() yang mengirim data form-encoded
    username = request.POST.get('username')
    password = request.POST.get('password')
    user = authenticate(request, username=username, password=password)

    if user is not None:
        if user.is_active:
            auth_login(request, user)
            return JsonResponse({
                "username": user.username,
                "status": True,
                "message": "Login successful!"
            }, status=200)
        else:
            return JsonResponse({
                "status": False,
                "message": "Login failed, account is disabled."
            }, status=401)
    else:
        return JsonResponse({
            "status": False,
            "message": "Login failed, please check your username or password."
        }, status=401)

# --- VIEW REGISTER ---
@csrf_exempt
def register(request):
    if request.method == 'POST':
        # Menggunakan json.loads karena Flutter menggunakan request.postJson()
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"status": False, "message": "Invalid JSON format."}, status=400)
            
        username = data.get('username')
        password1 = data.get('password1')
        password2 = data.get('password2')

        if not username or not password1 or not password2:
             return JsonResponse({"status": False, "message": "All fields are required."}, status=400)

        if password1 != password2:
            return JsonResponse({"status": False, "message": "Passwords do not match."}, status=400)
        
        if User.objects.filter(username=username).exists():
            return JsonResponse({"status": False, "message": "Username already exists."}, status=400)
        
        user = User.objects.create_user(username=username, password=password1)
        user.save()
        
        return JsonResponse({
            "username": user.username,
            "status": 'success',
            "message": "User created successfully!"
        }, status=200)
    
    return JsonResponse({"status": False, "message": "Invalid request method."}, status=400)

# --- VIEW LOGOUT ---
@csrf_exempt
def logout(request):
    username = request.user.username if request.user.is_authenticated else "User"
    try:
        auth_logout(request)
        return JsonResponse({
            "username": username,
            "status": True,
            "message": "Logged out successfully!"
        }, status=200)
    except Exception:
        return JsonResponse({
            "status": False,
            "message": "Logout failed."
        }, status=401)