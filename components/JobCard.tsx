"use client";

import { MapPin, Trash2, Bookmark } from "lucide-react";
import { Job } from "@/lib/db";

interface JobCardProps {
  job: Job;
  currentUserId?: number;
  isSelected?: boolean;
  isSaved?: boolean;
  onSelectJob: (job: Job) => void;
  onApplyJob: (job: Job) => void;
  onToggleSaveJob?: (jobId: number, e: React.MouseEvent) => void;
  onDeleteJob?: (jobId: number) => void;
}

export function JobCard({
  job,
  currentUserId,
  isSelected = false,
  isSaved = false,
  onSelectJob,
  onToggleSaveJob,
  onDeleteJob,
}: JobCardProps) {
  const isOwner = Boolean(
    currentUserId &&
      (job.user_id === undefined ||
        job.user_id === null ||
        Number(job.user_id) === Number(currentUserId))
  );

  const formattedDate = new Date(job.created_at).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });

  return (
    <div
      onClick={() => onSelectJob(job)}
      className={`group relative bg-white dark:bg-neutral-950 p-4 sm:p-4.5 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col justify-between ${
        isSelected
          ? "border-neutral-900 dark:border-neutral-100 bg-neutral-50/60 dark:bg-neutral-900/60 shadow-xs"
          : "border-neutral-200/80 dark:border-neutral-800/80 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-50/40 dark:hover:bg-neutral-900/30"
      }`}
    >
      <div>
        {/* Header: Company + Application Channel Badge + Actions */}
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
              {job.recruiter_avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={job.recruiter_avatar_url}
                  alt={job.company}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>
                  {job.company ? job.company.charAt(0).toUpperCase() : "V"}
                </span>
              )}
            </div>

            <span className="text-sm font-normal text-black dark:text-neutral-400 truncate">
              {job.company}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {job.contract_type && (
              <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded border border-neutral-200/60 dark:border-neutral-800">
                {job.contract_type}
              </span>
            )}

            {onToggleSaveJob && (
              <button
                type="button"
                onClick={(e) => onToggleSaveJob(job.id, e)}
                className="p-1 rounded transition-colors"
                title={isSaved ? "Remover dos salvos" : "Salvar vaga"}
              >
                <Bookmark
                  className={`w-5 h-5 transition-all ${
                    isSaved
                      ? "fill-emerald-600 text-black dark:fill-emerald-500 dark:text-white"
                      : "fill-none text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                />
              </button>
            )}

            {isOwner && onDeleteJob && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteJob(job.id);
                }}
                className="p-1 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                title="Excluir vaga"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Job Title */}
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1 mb-2 tracking-tight">
          {job.title}
        </h3>

        {/* Footer: Location, Salary & Date */}
        <div className="flex items-center justify-between text-xs text-neutral-800 dark:text-neutral-200 pt-2.5 border-t border-neutral-100 dark:border-neutral-900">
          <div className="flex items-center gap-1.5 truncate font-normal">
            <MapPin className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400 shrink-0" />
            <span className="truncate text-neutral-800 dark:text-neutral-200">
              {job.location}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {job.salary && (
              <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                R$ {job.salary}
              </span>
            )}
            <span className="font-normal text-neutral-700 dark:text-neutral-300">
              {formattedDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
