"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  FileText,
  UploadCloud,
  FileCheck,
  Trash2,
  Save,
  ArrowLeft,
  Camera,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Target,
  Settings,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

type TabType =
  | "personalInfo"
  | "resumeAndExperience"
  | "jobPreferences"
  | "accountSettings";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>("personalInfo");
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Form fields
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [location, setLocation] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [preferredRole, setPreferredRole] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [preferredContract, setPreferredContract] = useState("");
  const [professionalSummary, setProfessionalSummary] = useState("");

  // Upload & Action states
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Feedback notifications
  const [toast, setToast] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const fetchUser = async () => {
    setLoadingUser(true);
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setName(data.user.name || "");
          setLastName(data.user.last_name || "");
          setEmail(data.user.email || "");
          setCpf(data.user.cpf || "");
          setPhone(data.user.phone || "");
          setLinkedinUrl(data.user.linkedin_url || "");
          setGithubUrl(data.user.github_url || "");
          setLocation(data.user.location || "");
          setEmploymentStatus(
            data.user.employment_status || "Em busca de oportunidades",
          );
          setAvatarUrl(data.user.avatar_url || "");
          setResumeUrl(data.user.resume_url || "");
          setPreferredRole(data.user.preferred_role || "");
          setExpectedSalary(data.user.expected_salary || "");
          setPreferredContract(data.user.preferred_contract || "Remoto");
          setProfessionalSummary(data.user.professional_summary || "");
        }
      }
    } catch (err) {
      console.error("Erro ao carregar perfil:", err);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Upload Avatar
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setErrorMsg("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "avatar");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro no upload da foto");

      setAvatarUrl(data.url);
      showToast("Foto de perfil atualizada!");
    } catch (err: any) {
      setErrorMsg(err.message || "Falha ao enviar imagem.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Upload PDF CV
  const handlePdfChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setErrorMsg("Envie apenas arquivos no formato PDF.");
      return;
    }

    setUploadingPdf(true);
    setErrorMsg("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "pdf");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro no upload do PDF");

      setResumeUrl(data.url);
      showToast("Currículo em PDF anexado com sucesso!");
    } catch (err: any) {
      setErrorMsg(err.message || "Falha ao enviar arquivo PDF.");
    } finally {
      setUploadingPdf(false);
    }
  };

  // Remove PDF CV
  const handleRemovePdf = () => {
    if (confirm("Deseja realmente remover seu currículo em PDF do perfil?")) {
      setResumeUrl("");
      showToast("PDF do currículo removido.");
    }
  };

  // Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSavingProfile(true);

    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          last_name: lastName,
          email,
          location,
          employment_status: employmentStatus,
          avatar_url: avatarUrl,
          resume_url: resumeUrl,
          preferred_role: preferredRole,
          expected_salary: expectedSalary,
          preferred_contract: preferredContract,
          professional_summary: professionalSummary,
          cpf,
          phone,
          linkedin_url: linkedinUrl,
          github_url: githubUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao salvar alterações");

      setUser(data.user);
      showToast("Perfil salvo com sucesso!");
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao atualizar dados do perfil.");
    } finally {
      setSavingProfile(false);
    }
  };

  // Logout Action
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  // Delete Account Action
  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      const res = await fetch("/api/users/profile", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao excluir conta.");
      }
      showToast("Sua conta foi excluída.");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (err: any) {
      alert(err.message || "Erro ao excluir conta.");
      setDeletingAccount(false);
      setShowDeleteModal(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center text-neutral-500">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          <span>Carregando dados do perfil...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-black p-8 rounded-xl border border-neutral-200 dark:border-neutral-800 text-center max-w-md shadow-xl">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
            Acesso Restrito
          </h2>
          <p className="text-sm text-neutral-500 mb-6">
            Você precisa estar logado para acessar seu perfil e gerenciar suas
            preferências.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-md text-sm font-semibold shadow-md hover:bg-emerald-700 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para a Página Inicial</span>
          </Link>
        </div>
      </div>
    );
  }

  const sidebarTabs = [
    { id: "personalInfo", label: "Dados Pessoais", icon: User },
    {
      id: "resumeAndExperience",
      label: "Currículo & Experiência",
      icon: FileText,
    },
    { id: "jobPreferences", label: "Preferências de Vagas", icon: Target },
    { id: "accountSettings", label: "Configurações da Conta", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-white flex flex-col font-sans transition-colors">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-neutral-900 text-white dark:bg-white dark:text-black px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-sm font-semibold border border-neutral-800 dark:border-neutral-200 animate-slideDown">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        user={user}
        onOpenAuth={() => {}}
        onOpenPostJob={() => {}}
        onOpenApplications={() => {}}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Layout: Sidebar + Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-black rounded-xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-sm sticky top-24">
              {/* User Avatar Mini Card */}
              <div className="flex items-center gap-3 pb-5 mb-5 border-b border-neutral-100 dark:border-neutral-800">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-lg border-2 border-white dark:border-neutral-800">
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{name ? name.charAt(0).toUpperCase() : "U"}</span>
                    )}
                  </div>
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                    {name} {lastName}
                  </h3>
                  <p className="text-[11px] text-neutral-500 truncate capitalize">
                    {user.role === "recruiter" ? "Recrutador" : "Candidato"}
                  </p>
                </div>
              </div>

              {/* Sidebar Menu Options */}
              <nav className="space-y-1.5">
                {sidebarTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-semibold transition-all ${
                        isActive
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                          : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Right Main Content Section */}
          <section className="lg:col-span-3">
            <form onSubmit={handleSaveProfile} className="space-y-6">
              {errorMsg && (
                <div className="p-4 text-sm bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 rounded-2xl border border-rose-200 dark:border-rose-900">
                  {errorMsg}
                </div>
              )}

              {/* TAB 1: Dados Pessoais */}
              {activeTab === "personalInfo" && (
                <div className="bg-white dark:bg-black rounded-xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6 animate-fadeIn">
                  <div className="border-b border-neutral-100 dark:border-neutral-800 pb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        <span>Dados Pessoais & Localização</span>
                      </h2>
                      <p className="text-sm text-neutral-500 mt-0.5">
                        Altere sua foto de perfil, nome e informações principais
                      </p>
                    </div>
                  </div>

                  {/* Photo Upload Zone */}
                  <div className="flex items-center gap-6 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                    <div className="relative group">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center text-2xl font-bold shadow-md">
                        {avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={avatarUrl}
                            alt="Foto"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>
                            {name ? name.charAt(0).toUpperCase() : "U"}
                          </span>
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 p-1.5 bg-emerald-600 text-white rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform">
                        <Camera className="w-3.5 h-3.5" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                          disabled={uploadingAvatar}
                        />
                      </label>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
                        Foto de Perfil
                      </h4>
                      <p className="text-[11px] text-neutral-500 mb-2">
                        Suporta arquivos PNG, JPG ou WEBP (máximo 10MB)
                      </p>
                      <label className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-neutral-900 px-3 py-1.5 rounded-md border border-emerald-200 dark:border-neutral-800 cursor-pointer hover:bg-emerald-100 transition-colors">
                        <Camera className="w-3.5 h-3.5" />
                        <span>
                          {uploadingAvatar ? "Enviando..." : "Alterar Foto"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                          disabled={uploadingAvatar}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Nome *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu primeiro nome"
                        className="w-full px-4 py-2.5 text-sm bg-white dark:bg-black text-neutral-900 dark:text-white rounded-md border border-neutral-300 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Sobrenome
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Seu sobrenome"
                        className="w-full px-4 py-2.5 text-sm bg-white dark:bg-black text-neutral-900 dark:text-white rounded-md border border-neutral-300 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="w-full px-4 py-2.5 text-sm bg-white dark:bg-black text-neutral-900 dark:text-white rounded-md border border-neutral-300 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        CPF
                      </label>
                      <input
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        placeholder="000.000.000-00"
                        className="w-full px-4 py-2.5 text-sm bg-white dark:bg-black text-neutral-900 dark:text-white rounded-md border border-neutral-300 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Celular / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="w-full px-4 py-2.5 text-sm bg-white dark:bg-black text-neutral-900 dark:text-white rounded-md border border-neutral-300 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Localização / Cidade
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Ex: São Paulo, SP / Remoto"
                        className="w-full px-4 py-2.5 text-sm bg-white dark:bg-black text-neutral-900 dark:text-white rounded-md border border-neutral-300 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Perfil do LinkedIn (URL)
                      </label>
                      <input
                        type="url"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        placeholder="https://linkedin.com/in/seu-perfil"
                        className="w-full px-4 py-2.5 text-sm bg-white dark:bg-black text-neutral-900 dark:text-white rounded-md border border-neutral-300 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Perfil do GitHub (URL)
                      </label>
                      <input
                        type="url"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        placeholder="https://github.com/seu-usuario"
                        className="w-full px-4 py-2.5 text-sm bg-white dark:bg-black text-neutral-900 dark:text-white rounded-md border border-neutral-300 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Situação Empregatícia
                      </label>
                      <select
                        value={employmentStatus}
                        onChange={(e) => setEmploymentStatus(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-white dark:bg-black text-neutral-900 dark:text-white rounded-md border border-neutral-300 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Em busca de oportunidades">
                          Em busca de oportunidades (Disponível)
                        </option>
                        <option value="Empregado - Aberto a propostas">
                          Empregado - Aberto a propostas
                        </option>
                        <option value="Empregado - Não estou procurando">
                          Empregado - Não estou procurando
                        </option>
                        <option value="Freelancer / Prestador PJ">
                          Freelancer / Prestador PJ
                        </option>
                        <option value="Recrutador / Contratante">
                          Recrutador / Contratante
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Currículo & Experiência */}
              {activeTab === "resumeAndExperience" && (
                <div className="bg-white dark:bg-black rounded-xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6 animate-fadeIn">
                  <div className="border-b border-neutral-100 dark:border-neutral-800 pb-4">
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                      <span>Currículo em PDF & Resumo Profissional</span>
                    </h2>
                    <p className="text-sm text-neutral-500 mt-0.5">
                      Gerencie seu arquivo PDF e destaque suas principais
                      qualificações para as oportunidades.
                    </p>
                  </div>

                  {/* Current PDF Status / Upload Area */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                      Arquivo do Currículo (PDF)
                    </label>

                    {resumeUrl ? (
                      <div className="p-4 bg-emerald-50 dark:bg-neutral-900 rounded-2xl border border-emerald-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-emerald-600 text-white rounded-md shadow-md">
                            <FileCheck className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                              Currículo em PDF Anexado
                            </h4>
                            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 truncate max-w-[200px] sm:max-w-[320px]">
                              {resumeUrl}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md shadow-sm transition-all"
                          >
                            Visualizar PDF
                          </a>

                          <button
                            type="button"
                            onClick={handleRemovePdf}
                            className="p-2 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/50 rounded-md transition-colors"
                            title="Remover PDF do perfil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative border-2 border-dashed border-neutral-300 dark:border-neutral-800 hover:border-emerald-500 rounded-xl p-8 text-center bg-neutral-50/50 dark:bg-neutral-900/50 transition-colors">
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          onChange={handlePdfChange}
                          disabled={uploadingPdf}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />

                        {uploadingPdf ? (
                          <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 py-4">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span className="text-sm font-semibold">
                              Enviando seu currículo em PDF...
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <UploadCloud className="w-10 h-10 text-emerald-500 mx-auto" />
                            <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                              Clique para anexar seu arquivo{" "}
                              <span className="text-emerald-600">.PDF</span>
                            </h4>
                            <p className="text-sm text-neutral-400">
                              Suporta arquivos em formato PDF (tamanho máximo de
                              10MB)
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Resumo da Sua Experiência & Tecnologias
                    </label>
                    <textarea
                      rows={5}
                      value={professionalSummary}
                      onChange={(e) => setProfessionalSummary(e.target.value)}
                      placeholder="Descreva brevemente suas conquistas, principais habilidades (React, Next.js, Node, Design Systems, etc.) e objetivos de carreira..."
                      className="w-full px-4 py-3 text-sm bg-white dark:bg-black text-neutral-900 dark:text-white rounded-md border border-neutral-300 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: Preferências de Vagas */}
              {activeTab === "jobPreferences" && (
                <div className="bg-white dark:bg-black rounded-xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6 animate-fadeIn">
                  <div className="border-b border-neutral-100 dark:border-neutral-800 pb-4">
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                      <span>Preferências de Vagas & Salário</span>
                    </h2>
                    <p className="text-sm text-neutral-500 mt-0.5">
                      Defina o cargo de interesse, pretensão salarial e modelo
                      de contrato desejado.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Cargo / Função Preferida
                      </label>
                      <input
                        type="text"
                        value={preferredRole}
                        onChange={(e) => setPreferredRole(e.target.value)}
                        placeholder="Ex: Desenvolvedor Frontend / Fullstack"
                        className="w-full px-4 py-2.5 text-sm bg-white dark:bg-black text-neutral-900 dark:text-white rounded-md border border-neutral-300 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Pretensão Salarial Média
                      </label>
                      <input
                        type="text"
                        value={expectedSalary}
                        onChange={(e) => setExpectedSalary(e.target.value)}
                        placeholder="Ex: R$ 10.000 - R$ 14.000 / mês"
                        className="w-full px-4 py-2.5 text-sm bg-white dark:bg-black text-neutral-900 dark:text-white rounded-md border border-neutral-300 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Modalidade / Contrato Preferido
                      </label>
                      <select
                        value={preferredContract}
                        onChange={(e) => setPreferredContract(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-white dark:bg-black text-neutral-900 dark:text-white rounded-md border border-neutral-300 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Remoto">
                          Remoto (Trabalho de qualquer lugar)
                        </option>
                        <option value="PJ">PJ (Pessoa Jurídica)</option>
                        <option value="CLT">CLT (Carteira Assinada)</option>
                        <option value="Híbrido">
                          Híbrido (Presencial + Remoto)
                        </option>
                        <option value="Qualquer">
                          Aberto a qualquer formato
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Configurações da Conta */}
              {activeTab === "accountSettings" && (
                <div className="bg-white dark:bg-black rounded-xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6 animate-fadeIn">
                  <div className="border-b border-neutral-100 dark:border-neutral-800 pb-4">
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                      <Settings className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
                      <span>Configurações da Conta & Segurança</span>
                    </h2>
                    <p className="text-sm text-neutral-500 mt-0.5">
                      Gerencie seu acesso, faça logout ou solicite a exclusão
                      dos seus dados.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Logout Option */}
                    <div className="p-5 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                          Encerrar Sessão
                        </h4>
                        <p className="text-[11px] text-neutral-500">
                          Desconectar do site neste navegador
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:text-rose-600 bg-white dark:bg-black px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-800 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sair do Site</span>
                      </button>
                    </div>

                    {/* Delete Account Danger Zone */}
                    <div className="p-5 bg-rose-50/60 dark:bg-neutral-900 rounded-2xl border border-rose-200 dark:border-rose-900/60 flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-rose-900 dark:text-rose-400 flex items-center gap-1.5">
                          <ShieldAlert className="w-4 h-4 text-rose-600" />
                          <span>Exclusão Definitiva da Conta</span>
                        </h4>
                        <p className="text-[11px] text-rose-700 dark:text-rose-400">
                          Excluir seu perfil, histórico e todos os dados
                          permanentemente
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center gap-1.5 text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-md shadow-sm transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Excluir Minha Conta</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Footer Button (visible for info tabs) */}
              {activeTab !== "accountSettings" && (
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-sm px-8 py-3.5 rounded-md shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {savingProfile ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>
                      {savingProfile
                        ? "Salvando Alterações..."
                        : "Salvar Alterações do Perfil"}
                    </span>
                  </button>
                </div>
              )}
            </form>
          </section>
        </div>
      </main>

      {/* Delete Account Modal Dialog */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-black w-full max-w-md rounded-3xl p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              Confirmar Exclusão de Conta?
            </h3>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Esta ação é irreversível. Todos os seus dados de perfil,
              preferências e candidaturas associadas serão permanentemente
              removidos.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={deletingAccount}
                onClick={handleDeleteAccount}
                className="bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold px-5 py-2 rounded-md shadow-md transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>
                  {deletingAccount
                    ? "Excluindo..."
                    : "Sim, Excluir Minha Conta"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
