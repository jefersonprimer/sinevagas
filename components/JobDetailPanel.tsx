"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  Calendar,
  Send,
  CheckCircle2,
  User,
  Mail,
  Link as LinkIcon,
  FileText,
  UploadCloud,
  FileCheck,
  Loader2,
  Bookmark,
  Share2,
} from "lucide-react";
import { Job } from "@/lib/db";
import { CompleteApplicationModal } from "@/components/CompleteApplicationModal";

interface JobDetailPanelProps {
  job: Job | null;
  currentUser?: any | null;
  isSaved?: boolean;
  onOpenAuth?: (tab?: "login" | "register") => void;
  onSuccessApply?: () => void;
  onToggleSave?: (jobId: number) => void;
  onShareJob?: (jobId: number) => void;
}

export function JobDetailPanel({
  job,
  currentUser,
  isSaved = false,
  onOpenAuth,
  onSuccessApply,
  onToggleSave,
  onShareJob,
}: JobDetailPanelProps) {
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [isMissingCvModalOpen, setIsMissingCvModalOpen] = useState(false);
  const [candidateName, setCandidateName] = useState(currentUser?.name || "");
  const [candidateEmail, setCandidateEmail] = useState(
    currentUser?.email || "",
  );

  // Resume type & link
  const [resumeMode, setResumeMode] = useState<"pdf" | "url">("pdf");
  const [resumeLink, setResumeLink] = useState("");
  const [, setSelectedFile] = useState<File | null>(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");

  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Reset form when job changes
  useEffect(() => {
    setShowApplyForm(false);
    setIsMissingCvModalOpen(false);
    setErrorMsg("");
    setSuccessMsg("");
    if (currentUser) {
      const fullName =
        `${currentUser.name || ""} ${currentUser.last_name || ""}`.trim();
      setCandidateName(fullName || currentUser.email || "");
      setCandidateEmail(currentUser.email || "");
      if (currentUser.resume_url) {
        setResumeLink(currentUser.resume_url);
      }
    }
  }, [job, currentUser]);

  const handleApplyClick = () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (job?.application_type === "external" && job.external_url) {
      window.open(job.external_url, "_blank");
      return;
    }

    if (job?.application_type === "whatsapp" && job.contact_whatsapp) {
      const cleanPhone = job.contact_whatsapp.replace(/\D/g, "");
      const msg = encodeURIComponent(
        `Olá! Vi a vaga de "${job.title}" na empresa "${job.company}" divulgada no SineVagas e gostaria de me candidatar.`,
      );
      window.open(
        `https://wa.me/${cleanPhone.startsWith("55") ? cleanPhone : "55" + cleanPhone}?text=${msg}`,
        "_blank",
      );
      return;
    }

    if (job?.application_type === "email" && job.contact_email) {
      const subject = encodeURIComponent(
        `Candidatura: ${job.title} - SineVagas`,
      );
      window.location.href = `mailto:${job.contact_email}?subject=${subject}`;
      return;
    }

    // 1. Check if user is logged in
    if (!currentUser) {
      if (onOpenAuth) {
        onOpenAuth("login");
      }
      return;
    }

    // 2. Check if user has resume_url attached in profile
    if (currentUser.resume_url) {
      handleDirectApply(currentUser.resume_url);
    } else {
      // User is logged in but missing resume PDF: open CENTERED MODAL for attention
      setIsMissingCvModalOpen(true);
    }
  };

  const handleDirectApply = async (resumeUrl: string) => {
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const fullName =
        `${currentUser.name || ""} ${currentUser.last_name || ""}`.trim() ||
        currentUser.email;
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: job?.id,
          candidate_name: fullName,
          candidate_email: currentUser.email,
          candidate_phone: currentUser.phone,
          candidate_location: currentUser.location,
          linkedin_url: currentUser.linkedin_url,
          github_url: currentUser.github_url,
          resume_link: resumeUrl,
          cover_letter: "Candidatura enviada via perfil verificado",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao enviar candidatura");
      }

      setSuccessMsg(
        "Sua candidatura foi enviada instantaneamente com os dados e currículo do seu perfil!",
      );
      if (onSuccessApply) onSuccessApply();
      setTimeout(() => {
        setSuccessMsg("");
      }, 4000);
    } catch (err: any) {
      setErrorMsg(err.message || "Falha ao enviar candidatura.");
      setShowApplyForm(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (!job) {
    return (
      <div className="h-full min-h-[400px] bg-white dark:bg-black rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-400 flex items-center justify-center mb-3 border border-neutral-200 dark:border-neutral-800">
          <Building2 className="w-6 h-6 text-neutral-400" />
        </div>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
          Selecione uma vaga para visualizar os detalhes
        </h3>
        <p className="text-xs text-neutral-500 max-w-xs">
          Clique em qualquer vaga na lista ao lado para ver a descrição completa
          e os requisitos.
        </p>
      </div>
    );
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setErrorMsg("Por favor, selecione um arquivo em formato PDF.");
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
    setErrorMsg("");
    setSuccessMsg("");

    if (!candidateName || !candidateEmail) {
      setErrorMsg("Preencha seu Nome Completo e E-mail.");
      return;
    }

    if (!resumeLink) {
      setErrorMsg(
        resumeMode === "pdf"
          ? "Por favor, selecione e faça o upload do seu arquivo de currículo em PDF."
          : "Por favor, informe o link do seu currículo ou portfólio.",
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: job.id,
          candidate_name: candidateName,
          candidate_email: candidateEmail,
          resume_link: resumeLink,
          cover_letter: coverLetter,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao enviar candidatura");
      }

      setSuccessMsg("Sua candidatura foi enviada com sucesso ao recrutador!");
      if (onSuccessApply) onSuccessApply();
      setTimeout(() => {
        setShowApplyForm(false);
        setSuccessMsg("");
      }, 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Falha ao enviar candidatura.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-black rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden flex flex-col sticky top-20 max-h-[calc(100vh-5.5rem)]">
      {/* Header Minimalista */}
      <div className="p-5 border-b border-neutral-200/80 dark:border-neutral-800/80 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-bold text-sm flex items-center justify-center overflow-hidden shrink-0">
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
            <div>
              <span className="text-base font-normal text-black dark:text-neutral-400 block">
                {job.company}
              </span>
              <span className="inline-block text-[11px] font-mono text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded border border-neutral-200/60 dark:border-neutral-800 mt-0.5">
                {job.contract_type}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {onShareJob && (
              <button
                type="button"
                onClick={() => onShareJob(job.id)}
                className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded transition-colors"
                title="Copiar link da vaga"
              >
                <Share2 className="w-6 h-6" />
              </button>
            )}

            {onToggleSave && (
              <button
                type="button"
                onClick={() => onToggleSave(job.id)}
                className="p-1.5 rounded transition-colors"
                title={isSaved ? "Remover dos salvos" : "Salvar vaga"}
              >
                <Bookmark
                  className={`w-6 h-6 transition-all ${
                    isSaved
                      ? "fill-emerald-600 text-black dark:fill-emerald-500 dark:text-white"
                      : "fill-none text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                />
              </button>
            )}
          </div>
        </div>

        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white tracking-tight leading-snug">
          {job.title}
        </h2>
      </div>

      {/* Main Content Body */}
      <div className="p-6 overflow-y-auto space-y-6 flex-1 text-neutral-700 dark:text-neutral-300">
        {/* Metadata Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-neutral-50 dark:bg-neutral-900/90 rounded-lg border border-neutral-200/80 dark:border-neutral-800">
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block font-medium">
              Localização
            </span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-900 dark:text-neutral-100 mt-1">
              <MapPin className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400 shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
          </div>

          <div className="p-3 bg-neutral-50 dark:bg-neutral-900/90 rounded-lg border border-neutral-200/80 dark:border-neutral-800">
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block font-medium">
              Remuneração
            </span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-900 dark:text-neutral-100 mt-1">
              <span className="font-mono">R$ {job.salary || "A combinar"}</span>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3 bg-neutral-50 dark:bg-neutral-900/90 rounded-lg border border-neutral-200/80 dark:border-neutral-800">
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block font-medium">
              Publicada em
            </span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-900 dark:text-neutral-100 mt-1">
              <Calendar className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400 shrink-0" />
              <span>
                {new Date(job.created_at).toLocaleDateString("pt-BR")}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-2">
            Descrição da Vaga
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line text-neutral-600 dark:text-neutral-300">
            {job.description}
          </p>
        </div>

        {/* Requirements */}
        {job.requirements && (
          <div>
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-2">
              Requisitos e Qualificações
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line text-neutral-600 dark:text-neutral-300">
              {job.requirements}
            </p>
          </div>
        )}

        {/* Form Drawer / Application Section */}
        {showApplyForm && (
          <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800 bg-blue-50/50 dark:bg-neutral-900 p-5 rounded-2xl border border-blue-100 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
              <Send className="w-4 h-4 text-blue-600" />
              <span>Formulário de Candidatura</span>
            </h3>

            {errorMsg && (
              <div className="p-3 mb-4 text-xs bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 rounded-xl border border-rose-200 dark:border-rose-900">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 mb-4 text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 rounded-xl border border-emerald-200 dark:border-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Seu Nome Completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      required
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      placeholder="Ex: Maria Silva"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-black text-neutral-900 dark:text-white rounded-xl border border-neutral-300 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    E-mail de Contato *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="email"
                      required
                      value={candidateEmail}
                      onChange={(e) => setCandidateEmail(e.target.value)}
                      placeholder="maria@email.com"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-black text-neutral-900 dark:text-white rounded-xl border border-neutral-300 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Resume Mode Switcher (PDF vs URL) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Currículo (PDF ou Link) *
                  </label>

                  <div className="flex items-center gap-1 bg-neutral-200 dark:bg-neutral-900 p-0.5 rounded-lg text-[10px]">
                    <button
                      type="button"
                      onClick={() => setResumeMode("pdf")}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                        resumeMode === "pdf"
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-neutral-600 dark:text-neutral-400"
                      }`}
                    >
                      Enviar PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => setResumeMode("url")}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                        resumeMode === "url"
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-neutral-600 dark:text-neutral-400"
                      }`}
                    >
                      Inserir Link
                    </button>
                  </div>
                </div>

                {resumeMode === "pdf" ? (
                  <div className="relative border-2 border-dashed border-neutral-300 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-4 text-center bg-white dark:bg-black transition-colors">
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    {uploadingPdf ? (
                      <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 py-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-xs font-semibold">
                          Fazendo upload do arquivo PDF...
                        </span>
                      </div>
                    ) : resumeLink && uploadedFileName ? (
                      <div className="flex items-center justify-between bg-emerald-50 dark:bg-neutral-900 p-2.5 rounded-xl border border-emerald-200 dark:border-neutral-800 text-emerald-800 dark:text-emerald-200 text-xs font-medium">
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          <span className="font-semibold truncate max-w-[200px]">
                            {uploadedFileName}
                          </span>
                        </div>
                        <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                          PDF Anexado
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <UploadCloud className="w-7 h-7 text-blue-500 mx-auto" />
                        <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                          Clique para escolher seu arquivo{" "}
                          <span className="text-blue-600">.PDF</span>
                        </p>
                        <p className="text-[10px] text-neutral-400">
                          Suporta arquivos no formato PDF (máximo 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="url"
                      value={resumeLink}
                      onChange={(e) => setResumeLink(e.target.value)}
                      placeholder="https://linkedin.com/in/seuperfil ou link do Google Drive"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-black text-neutral-900 dark:text-white rounded-xl border border-neutral-300 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Carta de Apresentação / Observações (Opcional)
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                  <textarea
                    rows={3}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Conte brevemente por que você se destaca para esta oportunidade..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-black text-neutral-900 dark:text-white rounded-xl border border-neutral-300 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApplyForm(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingPdf}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold px-5 py-2 rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {submitting ? "Enviando..." : "Enviar Candidatura"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Footer Action */}
      <div className="p-4 bg-neutral-50 dark:bg-black border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
        <span className="text-xs text-neutral-500">
          Vaga publicada por {job.company}
        </span>

        {successMsg ? (
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-md border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-4 h-4" />
            <span>Candidatura Enviada!</span>
          </div>
        ) : !showApplyForm ? (
          <button
            onClick={handleApplyClick}
            disabled={submitting}
            className={`text-white text-sm font-semibold px-6 py-2.5 rounded-md shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 ${
              job.application_type === "whatsapp"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : job.application_type === "external"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : job.application_type === "email"
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enviando Candidatura...</span>
              </>
            ) : job.application_type === "whatsapp" ? (
              <>
                <span>Conversar no WhatsApp</span>
                <LinkIcon className="w-4 h-4" />
              </>
            ) : job.application_type === "external" ? (
              <>
                <span>Candidatar-se no site da empresa</span>
                <LinkIcon className="w-4 h-4" />
              </>
            ) : job.application_type === "email" ? (
              <>
                <Mail className="w-4 h-4" />
                <span>Enviar E-mail para RH</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Quero me Candidatar</span>
              </>
            )}
          </button>
        ) : null}
      </div>

      {/* Centered Modal for missing CV PDF */}
      <CompleteApplicationModal
        job={job}
        isOpen={isMissingCvModalOpen}
        onClose={() => setIsMissingCvModalOpen(false)}
        currentUser={currentUser}
        onSuccess={(newResumeUrl) => {
          if (currentUser) {
            currentUser.resume_url = newResumeUrl;
          }
          setSuccessMsg(
            "Sua candidatura foi enviada instantaneamente com seu novo currículo!",
          );
          if (onSuccessApply) onSuccessApply();
        }}
      />
    </div>
  );
}
