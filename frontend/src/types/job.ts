export type JobStatus =
  | "PENDING"
  | "QUEUED"
  | "PROCESSING"
  | "SUCCESS"
  | "FAILED"
  | "RETRYING"
  | "CANCELLED";

export type JobPriority = "HIGH" | "MEDIUM" | "LOW";

export interface Job {
  id: number;
  job_type: string;
  priority: JobPriority;
  status: JobStatus;
  progress: number;
  input_file?: string | null;
  payload?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  cancel_requested?: boolean;
  result?: JobResult | null;
  attempts?: JobAttempt[];
}

export interface JobResult {
  file_name: string;
  rows: number;
  columns: number;
  column_names: string[];
  missing_values: number;
  duplicate_rows: number;
}

export interface JobAttempt {
  attempt_number: number;
  status: JobStatus;
  error_message?: string | null;
  started_at: string;
  finished_at?: string | null;
}

export interface CreateJobPayload {
  job_type: "CSV_ANALYSIS";
  priority: JobPriority;
  input_file: File;
}
