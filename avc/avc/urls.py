from django.urls import path, include
from patient_app.admin import site
from patient_app import views, urls

urlpatterns = [      
    path('password/', include(urls)),
    path('', site.urls),
]