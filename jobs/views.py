from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Job
from .serializers import JobSerializer
from .tasks import process_job


class JobListCreateView(generics.ListCreateAPIView):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Job.objects.filter(
            user=self.request.user
        ).order_by("-created_at")

    def perform_create(self, serializer):
        job = serializer.save(
            user=self.request.user,
            status=Job.Status.QUEUED,
        )

        task = process_job.delay(job.id)

        job.celery_task_id = task.id
        job.save(
            update_fields=[
                "celery_task_id",
                "updated_at",
            ]
        )


class JobDetailView(generics.RetrieveAPIView):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Job.objects.filter(
            user=self.request.user
        )


class JobCancelView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            job = Job.objects.get(
                pk=pk,
                user=request.user,
            )

        except Job.DoesNotExist:
            return Response(
                {
                    "detail": "Job not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # Jobs that have already finished
        if job.status in [
            Job.Status.SUCCESS,
            Job.Status.FAILED,
            Job.Status.CANCELLED,
        ]:
            return Response(
                {
                    "detail": (
                        "This job can no longer be cancelled."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Request cancellation
        job.cancel_requested = True

        job.save(
            update_fields=[
                "cancel_requested",
                "updated_at",
            ]
        )

        return Response(
            {
                "detail": "Cancellation requested."
            },
            status=status.HTTP_202_ACCEPTED,
        )