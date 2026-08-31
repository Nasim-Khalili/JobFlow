from rest_framework import serializers

from .models import Job


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = [
            "id",
            "job_type",
            "priority",
            "status",
            "payload",
            "progress",
            "created_at",
            "updated_at",
            "input_file",
        ]

        read_only_fields = [
            "id",
            "status",
            "progress",
            "created_at",
            "updated_at",
        ]