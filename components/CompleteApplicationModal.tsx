"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  UploadCloud,
  FileCheck,
  Loader2,
  Send,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { Job } from "@/lib/db";

interface CompleteApplicationModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  onSuccess: (resumeUrl: string) => void;
}

export function CompleteApplicationModal({
  job,
  isOpen,
  onClose,
  currentUser,
  onSuccess,
}: CompleteApplicationModalProps) {
  const [mounted, setMounted] = useState(false);
  const [, setSelectedFile] = useState<File | null>(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [resumeLink, setResumeLink] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [candidatePhone, setCandidatePhone] = useState(currentUser?.phone || "");
  const [candidateLocation, setCandidateLocation] = useState(currentUser?.location || "");
  const [linkedinUrl, setLinkedinUrl] = useState(currentUser?.linkedin_url || "");
  const [githubUrl, setGithubUrl] = useState(currentUser?.github_url || "");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setMounted(true);
    if (currentUser) {
      if (currentUser.phone) setCandidatePhone(currentUser.phone);
      if (currentUser.location) setCandidateLocation(currentUser.location);
      if (currentUser.linkedin_url) setLinkedinUrl(currentUser.linkedin_url);
      if (currentUser.github_url) setGithubUrl(currentUser.github_url);
    }
  }, [currentUser]);

  if (!isOpen || !job || !currentUser || !mounted) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setErrorMsg("Por favor, selecione um arquivo no formato .PDF");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("O arquivo PDF não pode ultrapassar 10MB.");
      return;
    }

    setErrorMsg("");
    setSelectedFile(file);
    setUploadingPdf(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao realizar upload do PDF.");
      }

      setResumeLink(data.url);
      setUploadedFileName(file.name);
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao carregar o arquivo PDF.");
      setSelectedFile(null);
      setResumeLink("");
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeLink) {
      setErrorMsg(
        "Por favor, faça o upload do seu arquivo de currículo em PDF.",
      );
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const fullName =
        `${currentUser.name || ""} ${currentUser.last_name || ""}`.trim() ||
        currentUser.email;
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: job.id,
          candidate_name: fullName,
          candidate_email: currentUser.email,
          candidate_phone: candidatePhone,
          candidate_location: candidateLocation,
          linkedin_url: linkedinUrl,
          github_url: githubUrl,
          resume_link: resumeLink,
          cover_letter: coverLetter,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao enviar candidatura.");
      }

      // Salvamos o currículo também no perfil do usuário para que nas próximas vagas já esteja anexado!
      fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_url: resumeLink,
          phone: candidatePhone || undefined,
          location: candidateLocation || undefined,
          linkedin_url: linkedinUrl || undefined,
          github_url: githubUrl || undefined,
        }),
      }).catch(() => {});

      onSuccess(resumeLink);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Falha ao enviar candidatura.");
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-neutral-950/80 backdrop-blur-md animate-fadeIn flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden relative animate-scaleUp my-auto">
        {/* Header Alert */}
        <div className="p-6 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 text-white relative flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 shrink-0 mt-0.5">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-black tracking-wider uppercase bg-black/20 px-2 py-0.5 rounded-md text-emerald-100">
                Atenção Necessária
              </span>
              <h2 className="text-lg font-bold leading-tight mt-1">
                Anexe seu Currículo em PDF
              </h2>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Para se candidatar à vaga{" "}
                <strong className="text-white">{job.title}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Body Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* User Profile Badge */}
          <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-950/60 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              {currentUser.name
                ? currentUser.name.charAt(0).toUpperCase()
                : "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                {currentUser.name} {currentUser.last_name || ""}
              </p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                {currentUser.email}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3 h-3" /> Verificado
            </span>
          </div>

          {errorMsg && (
            <div className="p-3.5 text-xs bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 rounded-2xl border border-rose-200 dark:border-rose-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Upload Box */}
          <div>
            <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-2">
              Upload do Arquivo Currículo (.PDF) *
            </label>

            <div className="relative border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-md p-5 text-center bg-neutral-50/50 dark:bg-neutral-950/40 transition-colors">
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              {uploadingPdf ? (
                <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 py-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-xs font-semibold">
                    Fazendo upload do PDF...
                  </span>
                </div>
              ) : resumeLink ? (
                <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/60 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="font-semibold truncate max-w-[220px]">
                      {uploadedFileName || "Currículo.pdf"}
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                    ✓ PDF Carregado
                  </span>
                </div>
              ) : (
                <div className="space-y-1.5 py-2">
                  <UploadCloud className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    Clique ou arraste para selecionar seu{" "}
                    <span className="text-emerald-600">.PDF</span>
                  </p>
                  <p className="text-[10px] text-neutral-400">
                    Formato PDF obrigatório (Tamanho máximo: 10MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Optional Cover Letter */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Mensagem para o Recrutador (Opcional)
            </label>
            <textarea
              rows={2}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Ex: Tenho grande experiência na área e residência próxima..."
              className="w-full p-3 text-xs bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white rounded-md border border-neutral-300 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || uploadingPdf || !resumeLink}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-md shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Concluir e Enviar Candidatura</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
