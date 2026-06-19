from django.contrib import admin
from .models import (
    UserRegister,
    AdminUser,
    LiveClass,
    RecordedClass,
    Resource,
    Student,
    CertificateTemplate,
    Certificate,
    OnlineClass
)
@admin.register(UserRegister)
class UserRegisterAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'phone')  # columns visible in list view

@admin.register(AdminUser)
class AdminUserAdmin(admin.ModelAdmin):
    list_display = ('name', 'email')

@admin.register(OnlineClass)
class OnlineClassAdmin(admin.ModelAdmin):
    list_display = ('title', 'mentor', 'batch', 'status', 'start_time', 'meeting_id')
    list_filter = ('status', 'batch')
    search_fields = ('title', 'mentor__name', 'batch')
