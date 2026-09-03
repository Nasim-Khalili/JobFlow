import { Link } from "react-router-dom";
import type { Job } from "../types/job";
import StatusBadge from "./StatusBadge";
import ProgressBar from "./ProgressBar";

const date = (value: string) => new Date(value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });

export default function JobTable({ jobs, onCancel }: { jobs: Job[]; onCancel?: (job: Job) => void }) {
  return <div className="table-scroll"><table><thead><tr><th>ID</th><th>Job type</th><th>Priority</th><th>Status</th><th>Progress</th><th>Created</th><th /></tr></thead><tbody>{jobs.map((job) => <tr key={job.id}><td><Link className="job-id" to={`/jobs/${job.id}`}>#{job.id}</Link></td><td><strong>{job.job_type.replaceAll("_", " ")}</strong></td><td><span className={`priority priority-${job.priority.toLowerCase()}`}>{job.priority}</span></td><td><StatusBadge status={job.status} /></td><td><ProgressBar value={job.progress} /></td><td className="muted">{date(job.created_at)}</td><td className="actions"><Link to={`/jobs/${job.id}`}>View</Link>{["QUEUED", "PROCESSING", "RETRYING"].includes(job.status) && onCancel && <button className="text-button danger-text" onClick={() => onCancel(job)}>Cancel</button>}</td></tr>)}</tbody></table></div>;
}
