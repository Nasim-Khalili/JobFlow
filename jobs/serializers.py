from pathlib import Path

from rest_framework import serializers

from .models import Job, JobAttempt


class JobAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobAttempt
        fields = [
            "attempt_number",
            "status",
            "error_message",
            "started_at",
            "finished_at",
        ]


class JobSerializer(serializers.ModelSerializer):
    result = serializers.SerializerMethodField()
    attempts = JobAttemptSerializer(many=True, read_only=True)

    class Meta:
        model = Job
        fields = [
            "id",
            "job_type",
            "priority",
            "status",
            "payload",
            "input_file",
            "progress",
            "celery_task_id",
            "cancel_requested",
            "created_at",
            "updated_at",
            "result",
            "attempts",
        ]

    def get_result(self, obj):
        try:
            return obj.result.result
        except Job.result.RelatedObjectDoesNotExist:
            return None

        read_only_fields = [
            "id",
            "status",
            "progress",
            "celery_task_id",
            "cancel_requested",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):
        job_type = attrs.get("job_type")
        input_file = attrs.get("input_file")

        if input_file:
            extension = Path(input_file.name).suffix.lower()

            allowed_extensions = {
                Job.JobType.CSV_ANALYSIS: [".csv"],
                Job.JobType.TEXT_ANALYSIS: [".txt"],
                Job.JobType.IMAGE_PROCESSING: [
                    ".jpg",
                    ".jpeg",
                    ".png",
                ],
            }

            valid_extensions = allowed_extensions.get(job_type, [])

            if extension not in valid_extensions:
                raise serializers.ValidationError(
                    {
                        "input_file": (
                            f"File type {extension} is not allowed "
                            f"for {job_type}."
                        )
                    }
                )

        return attrs