from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

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

        process_job.delay(job.id)


class JobDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Job.objects.filter(
            user=self.request.user
        )