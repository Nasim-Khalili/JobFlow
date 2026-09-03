import api from "./api";
import type { CreateJobPayload, Job } from "../types/job";

interface PaginatedJobs {
  results: Job[];
}

export const getJobs = async (): Promise<Job[]> => {
  const response = await api.get<Job[] | PaginatedJobs>("/jobs/");

  return Array.isArray(response.data) ? response.data : response.data.results;
};

export const getJob = async (id: string): Promise<Job> => {
  const response = await api.get<Job>(`/jobs/${id}/`);
  return response.data;
};

export const createJob = async (payload: CreateJobPayload): Promise<Job> => {
  const formData = new FormData();
  formData.append("job_type", payload.job_type);
  formData.append("priority", payload.priority);
  formData.append("input_file", payload.input_file);
  const response = await api.post<Job>("/jobs/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const cancelJob = async (id: number): Promise<void> => {
  await api.post(`/jobs/${id}/cancel/`);
};