from celery import shared_task
from django.db import transaction
from django.utils import timezone

from .models import Job, JobAttempt, JobResult
from .processors import process_csv


@shared_task
def test_task():
    return "JobFlow Celery is working!"


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=5,
    retry_backoff_max=60,
    retry_jitter=False,
    retry_kwargs={"max_retries": 3},
)
def process_job(self, job_id):
    job = Job.objects.get(id=job_id)

    attempt_number = self.request.retries + 1

    attempt = JobAttempt.objects.create(
        job=job,
        attempt_number=attempt_number,
        status=Job.Status.PROCESSING,
    )

    try:
        # Check if cancellation was requested
        job.refresh_from_db()

        if job.cancel_requested:
            job.status = Job.Status.CANCELLED
            job.save(
                update_fields=[
                    "status",
                    "updated_at",
                ]
            )

            attempt.status = Job.Status.CANCELLED
            attempt.finished_at = timezone.now()
            attempt.save(
                update_fields=[
                    "status",
                    "finished_at",
                ]
            )

            return {
                "status": "cancelled"
            }

        # Start processing
        job.status = Job.Status.PROCESSING
        job.progress = 10

        job.save(
            update_fields=[
                "status",
                "progress",
                "updated_at",
            ]
        )

        # Validate job type
        if job.job_type != Job.JobType.CSV_ANALYSIS:
            raise ValueError(
                f"Unsupported job type: {job.job_type}"
            )

        # Validate input file
        if not job.input_file:
            raise ValueError(
                "CSV job has no input file."
            )

        # Update progress before processing
        job.progress = 30
        job.save(
            update_fields=[
                "progress",
                "updated_at",
            ]
        )

        # Process CSV
        result = process_csv(
            job.input_file.path
        )

        # Check cancellation after processing
        job.refresh_from_db()

        if job.cancel_requested:
            job.status = Job.Status.CANCELLED
            job.progress = 0

            job.save(
                update_fields=[
                    "status",
                    "progress",
                    "updated_at",
                ]
            )

            attempt.status = Job.Status.CANCELLED
            attempt.finished_at = timezone.now()

            attempt.save(
                update_fields=[
                    "status",
                    "finished_at",
                ]
            )

            return {
                "status": "cancelled"
            }

        # Processing completed
        job.progress = 80
        job.save(
            update_fields=[
                "progress",
                "updated_at",
            ]
        )

        # Save result and mark success
        with transaction.atomic():
            JobResult.objects.update_or_create(
                job=job,
                defaults={
                    "result": result,
                },
            )

            job.status = Job.Status.SUCCESS
            job.progress = 100

            job.save(
                update_fields=[
                    "status",
                    "progress",
                    "updated_at",
                ]
            )

            attempt.status = Job.Status.SUCCESS
            attempt.finished_at = timezone.now()

            attempt.save(
                update_fields=[
                    "status",
                    "finished_at",
                ]
            )

        return result

    except Exception as exc:
        attempt.status = Job.Status.FAILED
        attempt.error_message = str(exc)
        attempt.finished_at = timezone.now()

        attempt.save(
            update_fields=[
                "status",
                "error_message",
                "finished_at",
            ]
        )

        raise


@shared_task(
    bind=True,
    autoretry_for=(ValueError,),
    retry_backoff=5,
    retry_backoff_max=20,
    retry_jitter=False,
    retry_kwargs={"max_retries": 3},
)
def retry_test_task(self):
    print(
        f"Retry attempt: {self.request.retries + 1}"
    )

    raise ValueError(
        "Intentional failure for retry testing"
    )