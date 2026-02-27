from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import ChoiceQuiz

def quiz_detail(request, quiz_id):
    quiz = get_object_or_404(ChoiceQuiz, pk=quiz_id)
    data = {
        "id": quiz.id,
        "text": quiz.text,
        "correct_answer": quiz.correct_answer,
        "wrong_option_1": quiz.wrong_option_1,
        "wrong_option_2": quiz.wrong_option_2,
        "wrong_option_3": quiz.wrong_option_3,
        "created_at": quiz.created_at.isoformat(),
        "frequency": quiz.frequency,
        "n_of_correct": quiz.n_of_correct,
    }
    return JsonResponse(data)
