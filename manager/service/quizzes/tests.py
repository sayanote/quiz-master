from django.test import TestCase, Client
from django.urls import reverse
from .models import ChoiceQuiz

class QuizAPITests(TestCase):
    def setUp(self):
        self.client = Client()
        self.quiz1 = ChoiceQuiz.objects.create(
            text="Who is the gym leader of Asagi City?",
            correct_answer="Mikan",
            wrong_option_1="Hayato",
            wrong_option_2="Tsukushi",
            wrong_option_3="Akane",
            frequency=10,
            n_of_correct=5
        )
        self.quiz2 = ChoiceQuiz.objects.create(
            text="What is the capital of Japan?",
            correct_answer="Tokyo",
            wrong_option_1="Osaka",
            wrong_option_2="Nagoya",
            wrong_option_3="Fukuoka",
            frequency=100,
            n_of_correct=85
        )

    def test_get_quiz_detail(self):
        """
        Test that the quiz detail API returns the correct data for a given quiz ID.
        """
        url = reverse('quiz_detail', args=[self.quiz1.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['id'], self.quiz1.id)
        self.assertEqual(data['text'], self.quiz1.text)
        self.assertEqual(data['correct_answer'], self.quiz1.correct_answer)
        self.assertEqual(data['frequency'], 10)
        self.assertEqual(data['n_of_correct'], 5)

    def test_get_quiz_not_found(self):
        """
        Test that the API returns 404 for a non-existent quiz ID.
        """
        url = reverse('quiz_detail', args=[2147483647])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

    def test_get_random_quizzes_n_1(self):
        """
        Test that the random quizzes API returns 1 quiz when n=1.
        """
        url = reverse('random_quizzes')
        response = self.client.get(f"{url}?n=1")

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 1)

    def test_get_random_quizzes_n_large(self):
        """
        Test that the random quizzes API returns all quizzes if n is larger than total count.
        """
        url = reverse('random_quizzes')
        response = self.client.get(f"{url}?n=10")

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 2)

    def test_get_random_quizzes_no_duplicates(self):
        """
        Test that the random quizzes API returns unique quizzes.
        """
        url = reverse('random_quizzes')
        response = self.client.get(f"{url}?n=2")

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data), 2)
        self.assertNotEqual(data[0]['id'], data[1]['id'])

    def test_get_random_quizzes_invalid_n(self):
        """
        Test that the random quizzes API returns 400 for invalid n.
        """
        url = reverse('random_quizzes')
        
        # Test missing n
        response = self.client.get(url)
        self.assertEqual(response.status_code, 400)

        # Test non-integer n
        response = self.client.get(f"{url}?n=abc")
        self.assertEqual(response.status_code, 400)

        # Test non-positive n
        response = self.client.get(f"{url}?n=0")
        self.assertEqual(response.status_code, 400)
        response = self.client.get(f"{url}?n=-1")
        self.assertEqual(response.status_code, 400)

    def test_count_frequency_success(self):
        """
        Test that the count frequency API increments the frequency field.
        """
        url = reverse('count_frequency')
        response = self.client.post(f"{url}?id={self.quiz1.id}")

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['new_frequency'], 11)
        
        # Verify in DB
        self.quiz1.refresh_from_db()
        self.assertEqual(self.quiz1.frequency, 11)

    def test_count_frequency_no_id(self):
        """
        Test that the count frequency API returns 400 if no ID is provided.
        """
        url = reverse('count_frequency')
        response = self.client.post(url)
        self.assertEqual(response.status_code, 400)

    def test_count_frequency_not_found(self):
        """
        Test that the count frequency API returns 404 if quiz ID does not exist.
        """
        url = reverse('count_frequency')
        response = self.client.post(f"{url}?id=9999")
        self.assertEqual(response.status_code, 404)

    def test_count_frequency_get_not_allowed(self):
        """
        Test that the count frequency API returns 405 for GET requests.
        """
        url = reverse('count_frequency')
        response = self.client.get(f"{url}?id={self.quiz1.id}")
        self.assertEqual(response.status_code, 405)
