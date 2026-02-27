import random
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

def random_quizzes(request):
    n = request.GET.get('n')
    try:
        n = int(n)
        if n <= 0:
            return JsonResponse({"error": "n must be a positive integer"}, status=400)
    except (TypeError, ValueError):
        return JsonResponse({"error": "n must be a positive integer"}, status=400)

    quizzes = list(ChoiceQuiz.objects.all())
    count = len(quizzes)
    
    sample_size = min(n, count)
    selected_quizzes = random.sample(quizzes, sample_size)

    data = []
    for quiz in selected_quizzes:
        data.append({
            "id": quiz.id,
            "text": quiz.text,
            "correct_answer": quiz.correct_answer,
            "wrong_option_1": quiz.wrong_option_1,
            "wrong_option_2": quiz.wrong_option_2,
            "wrong_option_3": quiz.wrong_option_3,
            "created_at": quiz.created_at.isoformat(),
            "frequency": quiz.frequency,
            "n_of_correct": quiz.n_of_correct,
        })
    
    return JsonResponse(data, safe=False)
