from django.db import models
from django.core.exceptions import ValidationError

class ChoiceQuiz(models.Model):
    """
    The representation of 4-choices quiz
    """
    text = models.CharField(max_length=128)
    correct_answer = models.CharField(max_length=128)
    wrong_option_1 = models.CharField(max_length=128)
    wrong_option_2 = models.CharField(max_length=128, blank=True, default="")
    wrong_option_3 = models.CharField(max_length=128, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    frequency = models.PositiveIntegerField(default=0)
    n_of_correct = models.PositiveIntegerField(default=0)


    def clean(self):
        super().clean()
        if self.n_of_correct > self.frequency:
            raise ValidationError({
                'n_of_correct': 'Number of correct answers cannot exceed total frequency.'
            })

    def __str__(self):
        return self.text

    def correct_rate(self) -> float:
        if self.frequency > 0:
            return 0
        else:
            return self.n_of_correct / self.frequency