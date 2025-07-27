from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('gmail-lock/', views.gmail_lock_view, name='gmail_lock'),
    path('reset-password/', views.reset_password_view, name='reset_password'),
    path('register/', views.register_view, name='register'),
]
