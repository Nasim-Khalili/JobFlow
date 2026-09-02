from celery import shared_task
from django.db import transaction
from django.utils import timezone

from .models import Job, JobAttempt, JobResult
from .processors import process_csv


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
        job.status = Job.Status.PROCESSING
        job.progress = 10
        job.save(
            update_fields=[
                "status",
                "progress",
                "updated_at",
            ]
        )

        if job.job_type != Job.JobType.CSV_ANALYSIS:
            raise ValueError(
                f"Unsupported job type: {job.job_type}"
            )

        if not job.input_file:
            raise ValueError(
                "CSV job has no input file."
            )

        result = process_csv(
            job.input_file.path
        )

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