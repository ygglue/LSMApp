from django.db import models

class InteractionLog(models.Model):
    session_id = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)
    message_id = models.IntegerField()
    choice_text = models.CharField(max_length=255)
    next_message_id = models.IntegerField(null=True, blank=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.session_id} - {self.choice_text} ({self.timestamp})"
