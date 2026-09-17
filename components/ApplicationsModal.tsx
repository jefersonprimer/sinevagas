"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  ExternalLink,
  Calendar,
  User,
  Mail,
  Briefcase,
  RefreshCw,
  FileCheck,
} from "lucide-react";
import { Application } from "@/lib/db";

interface ApplicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: "candidate" | "recruiter";
}

export function ApplicationsModal({
  isOpen,
  onClose,
  userRole,
}: ApplicationsModalProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchApplications = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/applications");
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Erro ao carregar candidaturas");
      setApplications(data.applications || []);
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao carregar lista de candidaturas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchApplications();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {userRole === "recruiter"
                  ? "Candidaturas Recebidas"
                  : "Minhas Candidaturas"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {userRole === "recruiter"
                  ? "Acompanhe os talentos que se candidataram às suas vagas"
                  : "Histórico de vagas às quais você se candidatou"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchApplications}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Atualizar lista"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-slate-700 dark:text-slate-300">
          {errorMsg && (
            <div className="p-3 text-xs bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 rounded-xl border border-rose-200 dark:border-rose-900">
              {errorMsg}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Carregando candidaturas...
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                Nenhuma candidatura encontrada.
              </p>
            </div>
          ) : (
            applications.map((app) => {
              const isPdf =
                app.resume_link?.startsWith("/uploads/") ||
                app.resume_link?.endsWith(".pdf");

              const cleanPhone = app.candidate_phone
                ? app.candidate_phone.replace(/\D/g, "")
                : "";

              return (
                <div
                  key={app.id}
                  className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/70 hover:border-blue-500/40 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>{app.job_title || "Vaga de Emprego"}</span>
                      </div>
                      {app.company && (
                        <span className="text-[11px] text-slate-500 font-medium">
                          {app.company}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {new Date(app.created_at).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
                        <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>{app.candidate_name}</span>
                      </div>

                      {app.candidate_location && (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-700/60 px-2 py-0.5 rounded-md">
                          📍 {app.candidate_location}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <a
                          href={`mailto:${app.candidate_email}`}
                          className="hover:underline text-blue-500 truncate"
                        >
                          {app.candidate_email}
                        </a>
                      </div>

                      {app.candidate_phone && (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 font-bold shrink-0">📞</span>
                          <span className="truncate">{app.candidate_phone}</span>
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/${cleanPhone.startsWith("55") ? cleanPhone : "55" + cleanPhone}?text=${encodeURIComponent(`Olá ${app.candidate_name}! Vi sua candidatura para a vaga de ${app.job_title} no SineVagas.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-auto inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md hover:bg-emerald-200 transition-colors"
                              title="Chamar candidato no WhatsApp"
                            >
                              <span>WhatsApp</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {(app.linkedin_url || app.github_url) && (
                      <div className="flex items-center gap-2 pt-1">
                        {app.linkedin_url && (
                          <a
                            href={app.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-md hover:bg-blue-100 transition-colors"
                          >
                            <span>LinkedIn</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {app.github_url && (
                          <a
                            href={app.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 px-2.5 py-1 rounded-md hover:bg-slate-300 transition-colors"
                          >
                            <span>GitHub</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    )}

                    {app.cover_letter && (
                      <div className="mt-2 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-[11px] italic">
                        &quot;{app.cover_letter}&quot;
                      </div>
                    )}

                    <div className="pt-2 flex justify-end">
                      <a
                        href={app.resume_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-md border transition-colors ${
                          isPdf
                            ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
                            : "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900 hover:bg-blue-100"
                        }`}
                      >
                        {isPdf ? (
                          <>
                            <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span>Visualizar PDF do Currículo</span>
                          </>
                        ) : (
                          <>
                            <span>Abrir Link do Currículo</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </>
                        )}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-md transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
