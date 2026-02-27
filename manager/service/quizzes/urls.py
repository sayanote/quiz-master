from django.urls import path
from . import views

urlpatterns = [
    path('<int:quiz_id>/', views.quiz_detail, name='quiz_detail'),
    path('random/', views.random_quizzes, name='random_quizzes'),
]
