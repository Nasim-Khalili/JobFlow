from django.conf import settings
from django.db import models


class Job(models.Model):

    class JobType(models.TextChoices):
        CSV_ANALYSIS = "CSV_ANALYSIS", "CSV Analysis"
        IMAGE_PROCESSING = "IMAGE_PROCESSING", "Image Processing"
        TEXT_ANALYSIS = "TEXT_ANALYSIS", "Text Analysis"

    class Priority(models.TextChoices):
        LOW = "LOW", "Low"
        MEDIUM = "MEDIUM", "Medium"
        HIGH = "HIGH", "High"

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        QUEUED = "QUEUED", "Queued"
        PROCESSING = "PROCESSING", "Processing"
        SUCCESS = "SUCCESS", "Success"
        FAILED = "FAILED", "Failed"
        RETRYING = "RETRYING", "Retrying"
        CANCELLED = "CANCELLED", "Cancelled"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="jobs",
    )

    job_type = models.CharField(
        max_length=30,
        choices=JobType.choices,
    )

    priority = models.CharField(
        max_length=10,
        choices=Priority.choices,
        default=Priority.MEDIUM,
    )

    status = models.CharField(
        max_length=15,
        choices=Status.choices,
        default=Status.PENDING,
    )

    payload = models.JSONField(
        default=dict,
        blank=True,
    )

    progress = models.PositiveSmallIntegerField(
        default=0,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return f"{self.job_type} - {self.status}"