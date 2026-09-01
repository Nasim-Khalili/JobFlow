from celery import shared_task


@shared_task
def test_task():
    return "JobFlow Celery is working!"