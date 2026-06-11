from django.contrib import admin
from django.urls import path,include
from django.conf import settings

urlpatterns = [
    #path('admin/', admin.site.urls),
    path(settings.ADMIN_URL, admin.site.urls),
    path('api/', include('App.urls')),
]

from django.conf.urls.static import static
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
