from django.contrib import admin
from django.urls import path, include
from . import views


urlpatterns = [
    path('register/', views.register_user),
    path('verify/', views.login_user),
    path('register_student/', views.register_student),
    
    path('students/', views.get_students),
    path('student/notes/', views.student_notes),
    path('student/assignments/', views.student_assignments),
    path('student/live-classes/', views.student_live_classes),
    path('enroll/', views.create_enrollment),
    path('auth/google/', views.google_login),
    path('enrollments/', views.get_enrollments, name='get_enrollments'), 
    path('forgot-password/', views.forgot_password),
    path('live/', views.create_live_class),
    path('recorded/', views.create_recorded_class),
    path('resource/', views.create_resource),
    path('live-classes/<int:pk>/', views.delete_live_class),
    path('recorded-classes/<int:pk>/', views.delete_recorded_class),
    path('resources/<int:pk>/', views.delete_resource),
    # urls.py
    path('cart/', views.get_cart),              # GET
    path('addcart/', views.add_to_cart),       # POST
    path('deletecart/<int:id>/', views.delete_cart),  # DELETE
    path('clearcart/', views.clear_cart),
    path('dashboard-counts/', views.dashboard_counts),

    # Mentor Dashboard endpoints
    path('trainer/login/', views.trainer_login),
    path('trainer/profile/', views.trainer_profile),
    
    path('assignments/', views.manage_assignments),
    path('assignments/<int:pk>/', views.delete_assignment),
    path('notes/', views.manage_notes),
    path('notes/<int:pk>/', views.delete_note),
    path('attendance/', views.manage_attendance),
    path('mentor-overview/', views.mentor_overview),
    path('debug/', views.debug_db),
    path('batches/', views.manage_batches),
    path('batches/<int:pk>/', views.delete_batch),
    path('batches/<int:pk>/assign-mentor/', views.assign_mentor_to_batch),
    path('mentors/', views.manage_trainers),
    path('mentors/<int:pk>/', views.delete_trainer),
    path('enrollments/<int:pk>/assign/', views.assign_batch_mentor),
    path('student/assignments/submit/', views.submit_assignment),
    path('assignments/submissions/', views.get_assignment_submissions),
    path('courses/<str:course_id>/progress/', views.get_course_progress),
    path('courses-list/', views.manage_courses),
    path('courses-list/<int:pk>/', views.delete_course),
    path('contact/',views.contact),
]

from rest_framework.routers import DefaultRouter
router = DefaultRouter()
router.register(r'online-classes', views.OnlineClassViewSet, basename='online-class')

urlpatterns += router.urls
