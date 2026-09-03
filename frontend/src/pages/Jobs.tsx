import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import JobTable from "../components/JobTable";
import { EmptyState, ErrorState, LoadingState } from "../components/PageState";
import { cancelJob, getJobs } from "../services/jobs";
import type { Job } from "../types/job";

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const load = async () => { try { setError(""); setJobs(await getJobs()); } catch { setError("We could not load your jobs. Please try again."); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, []);
  const cancel = async (job: Job) => { if (!window.confirm(`Cancel job #${job.id}?`)) return; try { await cancelJob(job.id); await load(); } catch { setError("This job could not be cancelled."); } };
  return <div className="page"><header className="page-header"><div><p className="eyebrow">WORKSPACE</p><h1>All jobs</h1><p className="muted">Track every file moving through your pipeline.</p></div><Link className="primary-button" to="/jobs/create">+ Create job</Link></header><section className="content-panel">{loading ? <LoadingState label="Loading jobs..." /> : error ? <ErrorState message={error} /> : jobs.length === 0 ? <EmptyState title="No jobs yet">Create your first background job and start processing your data.</EmptyState> : <JobTable jobs={jobs} onCancel={cancel} />}</section></div>;
}
