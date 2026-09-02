from django.urls import path

from .views import (
    JobCancelView,
    JobDetailView,
    JobListCreateView,
)


urlpatterns = [
    path(
        "",
        JobListCreateView.as_view(),
        name="job-list-create",
    ),

    path(
        "<int:pk>/",
        JobDetailView.as_view(),
        name="job-detail",
    ),

    path(
        "<int:pk>/cancel/",
        JobCancelView.as_view(),
        name="job-cancel",
    ),
]