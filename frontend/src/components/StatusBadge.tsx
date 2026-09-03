import type { JobStatus } from "../types/job";

const labels: Record<JobStatus, string> = {
  PENDING: "Pending",
  QUEUED: "Queued",
  PROCESSING: "Processing",
  SUCCESS: "Successful",
  FAILED: "Failed",
  RETRYING: "Retrying",
  CANCELLED: "Cancelled",
};

export default function StatusBadge({ status }: { status: JobStatus }) {
  return <span className={`status status-${status.toLowerCase()}`}>{labels[status] ?? status}</span>;
}
