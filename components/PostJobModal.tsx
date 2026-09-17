"use client";

import React, { useState } from "react";
import { X, PlusCircle, CheckCircle2 } from "lucide-react";
import { Job } from "@/lib/db";

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated: (newJob: Job) => void;
}

export function PostJobModal({
  isOpen,
  onClose,
  onJobCreated,
}: PostJobModalProps) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [contractType, setContractType] = useState<
    "CLT" | "PJ" | "Remoto" | "Híbrido"
  >("Remoto");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");

  // Application / Contact Options
  const [applicationType, setApplicationType] = useState<
    "internal" | "external" | "whatsapp" | "email"
  >("internal");
  const [externalUrl, setExternalUrl] = useState("");
  const [contactWhatsapp, setContactWhatsapp] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!title || !company || !location || !contractType || !description) {
      setErrorMsg("Por favor, preencha todos os campos obrigatórios (*).");
      return;
    }

    if (applicationType === "external" && !externalUrl) {
      setErrorMsg("Por favor, informe a URL do site externo de candidatura.");
      return;
    }
    if (applicationType === "whatsapp" && !contactWhatsapp) {
      setErrorMsg("Por favor, informe o número de WhatsApp do recrutador.");
      return;
    }
    if (applicationType === "email" && !contactEmail) {
      setErrorMsg("Por favor, informe o e-mail do RH para envio de candidaturas.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          company,
          location,
          contract_type: contractType,
          salary,
          description,
          requirements,
          application_type: applicationType,
          external_url: externalUrl,
          contact_whatsapp: contactWhatsapp,
          contact_email: contactEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao publicar vaga.");
      }

      onJobCreated(data.job);
      onClose();
      // Reset form
      setTitle("");
      setCompany("");
      setLocation("");
      setSalary("");
      setDescription("");
      setRequirements("");
      setApplicationType("internal");
      setExternalUrl("");
      setContactWhatsapp("");
      setContactEmail("");
    } catch (err: any) {
      setErrorMsg(err.message || "Ocorreu um erro ao publicar a vaga.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Publicar Nova Vaga
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Anuncie sua oportunidade para milhares de candidatos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto space-y-4 flex-1 text-slate-700 dark:text-slate-300"
        >
          {errorMsg && (
            <div className="p-3 text-sm bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 rounded-md border border-rose-200 dark:border-rose-900">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Título do Cargo *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Desenvolvedor React Senior"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nome da Empresa *
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Ex: TechCorp Soluções"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Localização / Modalidade *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Remoto / SP"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tipo de Contrato *
              </label>
              <select
                value={contractType}
                onChange={(e: any) => setContractType(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Remoto">Remoto</option>
                <option value="CLT">CLT</option>
                <option value="PJ">PJ</option>
                <option value="Híbrido">Híbrido</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Salário / Faixa (Opcional)
              </label>
              <input
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="Ex: R$ 8.000 - R$ 10.000"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Descrição das Responsabilidades *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva as atividades diárias, cultura da equipe e impacto do cargo..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Requisitos & Qualificações
            </label>
            <textarea
              rows={3}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Ex: 3+ anos com React, Next.js, TypeScript e Git..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Canal de Candidatura / Opções de Contato do Recrutador */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-white mb-1">
                Como os candidatos devem se inscrever nesta vaga?
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                Escolha se prefere receber candidaturas no SineVagas, redirecionar para seu site (Gupy, LinkedIn, ATS), WhatsApp ou E-mail.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label className={`p-3 rounded-lg border cursor-pointer flex items-center gap-2 font-semibold transition-all ${
                applicationType === "internal"
                  ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              }`}>
                <input
                  type="radio"
                  name="appType"
                  value="internal"
                  checked={applicationType === "internal"}
                  onChange={() => setApplicationType("internal")}
                  className="accent-emerald-600"
                />
                <span>Candidatura Interna no SineVagas</span>
              </label>

              <label className={`p-3 rounded-lg border cursor-pointer flex items-center gap-2 font-semibold transition-all ${
                applicationType === "external"
                  ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              }`}>
                <input
                  type="radio"
                  name="appType"
                  value="external"
                  checked={applicationType === "external"}
                  onChange={() => setApplicationType("external")}
                  className="accent-emerald-600"
                />
                <span>Link Externo / ATS (Gupy, LinkedIn)</span>
              </label>

              <label className={`p-3 rounded-lg border cursor-pointer flex items-center gap-2 font-semibold transition-all ${
                applicationType === "whatsapp"
                  ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              }`}>
                <input
                  type="radio"
                  name="appType"
                  value="whatsapp"
                  checked={applicationType === "whatsapp"}
                  onChange={() => setApplicationType("whatsapp")}
                  className="accent-emerald-600"
                />
                <span>Contato Direto no WhatsApp</span>
              </label>

              <label className={`p-3 rounded-lg border cursor-pointer flex items-center gap-2 font-semibold transition-all ${
                applicationType === "email"
                  ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              }`}>
                <input
                  type="radio"
                  name="appType"
                  value="email"
                  checked={applicationType === "email"}
                  onChange={() => setApplicationType("email")}
                  className="accent-emerald-600"
                />
                <span>Envio por E-mail de RH</span>
              </label>
            </div>

            {applicationType === "external" && (
              <div className="pt-2 animate-fadeIn">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Link Externo do Processo Seletivo (URL) *
                </label>
                <input
                  type="url"
                  required
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://empresa.gupy.io/jobs/12345"
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-900 rounded-md border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}

            {applicationType === "whatsapp" && (
              <div className="pt-2 animate-fadeIn">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Número de Celular / WhatsApp do Recrutador (com DDD) *
                </label>
                <input
                  type="tel"
                  required
                  value={contactWhatsapp}
                  onChange={(e) => setContactWhatsapp(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-900 rounded-md border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}

            {applicationType === "email" && (
              <div className="pt-2 animate-fadeIn">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  E-mail do RH / Recrutamento *
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="rh@suaempresa.com"
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-900 rounded-md border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-6 py-2.5 rounded-md shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {submitting ? "Publicando..." : "Publicar Vaga Agora"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
