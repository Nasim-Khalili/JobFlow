import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import JobTable from "../components/JobTable";
import { EmptyState, ErrorState, LoadingState } from "../components/PageState";
import { getJobs } from "../services/jobs";
import type { Job, JobStatus } from "../types/job";

const statuses: JobStatus[] = ["QUEUED", "PROCESSING", "SUCCESS", "FAILED", "CANCELLED"];
export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { getJobs().then(setJobs).catch(() => setError("We could not load your jobs. Please try again.")).finally(() => setLoading(false)); }, []);
  const count = (status: JobStatus) => jobs.filter((job) => job.status === status).length;
  return <div className="page"><header className="page-header"><div><p className="eyebrow">YOUR WORKSPACE</p><h1>Good to see you.</h1><p className="muted">Here is what is happening across your workspace.</p></div><Link className="primary-button" to="/jobs/create">+ Create job</Link></header>{loading ? <LoadingState label="Loading workspace..." /> : error ? <ErrorState message={error} /> : <><section className="stats-grid"><div className="stat-card stat-featured"><span>Total jobs</span><strong>{jobs.length}</strong><small>All time</small></div>{statuses.map((status) => <div className="stat-card" key={status}><span>{status[0] + status.slice(1).toLowerCase()}</span><strong>{count(status)}</strong><small>{status === "PROCESSING" ? "Active now" : "In your workspace"}</small></div>)}</section><section className="section-heading"><div><p className="eyebrow">LATEST ACTIVITY</p><h2>Recent jobs</h2></div><Link to="/jobs">View all jobs →</Link></section><section className="content-panel">{jobs.length === 0 ? <EmptyState title="No jobs yet">Create your first background job and start processing your data.</EmptyState> : <JobTable jobs={jobs.slice(0, 5)} />}</section></>}</div>;
}