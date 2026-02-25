from django.db import models
from django.core.exceptions import ValidationError

class ChoiceQuiz(models.Model):
    text = models.CharField(max_length=128)
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
