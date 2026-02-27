from django.urls import path
from . import views

urlpatterns = [
    path('<int:quiz_id>/', views.quiz_detail, name='quiz_detail'),
]
