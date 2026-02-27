from django.test import TestCase, Client
from django.urls import reverse
from .models import ChoiceQuiz

class QuizAPITests(TestCase):
    def setUp(self):
        self.client = Client()
        self.quiz = ChoiceQuiz.objects.create(
            text="Who is the gym leader of Asagi City?",
            correct_answer="Mikan",
            wrong_option_1="Hayato",
            wrong_option_2="Tsukushi",
            wrong_option_3="Akane",
            frequency=10,
            n_of_correct=5
        )

    def test_get_quiz_detail(self):
        """
        Test that the quiz detail API returns the correct data for a given quiz ID.
        """
        url = reverse('quiz_detail', args=[self.quiz.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['id'], self.quiz.id)
        self.assertEqual(data['text'], self.quiz.text)
        self.assertEqual(data['correct_answer'], self.quiz.correct_answer)
        self.assertEqual(data['frequency'], 10)
        self.assertEqual(data['n_of_correct'], 5)

    def test_get_quiz_not_found(self):
        """
        Test that the API returns 404 for a non-existent quiz ID.
        """
        import sys

        # use max number of Integer
        int_max = sys.maxsize
        url = reverse('quiz_detail', args=[int_max])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
