from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages

# -------------------- LOGIN VIEW -------------------- #
def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        next_url = request.GET.get('next')  # Get ?next=mail from URL

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            if next_url == 'mail':
                # After successful login, redirect to Gmail with login_success param
                return redirect('https://mail.google.com/?login_success=true')
            else:
                return redirect('gmail_lock')  # Fallback page after login
        else:
            messages.error(request, 'Invalid username or password.')
            return redirect('login')

    # For GET requests, render login.html as usual
    return render(request, 'lockapp/login.html')

# -------------------- LOGOUT VIEW -------------------- #
def logout_view(request):
    logout(request)
    messages.success(request, "Logged out successfully.")
    return redirect('login')

def register_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')

        if password1 != password2:
            messages.error(request, 'Passwords do not match.')
            return redirect('register')

        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists.')
            return redirect('register')

        user = User.objects.create_user(username=username, password=password1)
        user.save()

        messages.success(request, 'Registration successful! Please login.')
        return redirect('login')

    return render(request, 'lockapp/register.html')

# -------------------- GMAIL LOCK VIEW (Fallback Protected Page) -------------------- #
@login_required(login_url='/login/')
def gmail_lock_view(request):
    # Directly redirect to Gmail with login_success=true
    return redirect('https://mail.google.com/?login_success=true')
# -------------------- RESET PASSWORD VIEW -------------------- #
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

def reset_password_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        new_password = request.POST.get('new_password')
        confirm_password = request.POST.get('confirm_password')

        if not User.objects.filter(username=username).exists():
            messages.error(request, 'Username does not exist.')
            return redirect('reset_password')

        if new_password != confirm_password:
            messages.error(request, 'Passwords do not match.')
            return redirect('reset_password')

        user = User.objects.get(username=username)
        user.password = make_password(new_password)
        user.save()

        messages.success(request, 'Password reset successfully. Please login.')
        return redirect('login')

    return render(request, 'lockapp/reset_password.html')
