"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JobCard } from "@/components/JobCard";
import { JobDetailPanel } from "@/components/JobDetailPanel";
import { PostJobModal } from "@/components/PostJobModal";
import { AuthModal } from "@/components/AuthModal";
import { ApplicationsModal } from "@/components/ApplicationsModal";
import { Job } from "@/lib/db";
import {
  Briefcase,
  Search,
  MapPin,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedType, setSelectedType] = useState("Todas");
  const [onlySaved, setOnlySaved] = useState(false);

  // Saved Jobs (Bookmarks) stored in LocalStorage
  const [savedJobIds, setSavedJobIds] = useState<number[]>([]);

  // Selected Job for Right Panel / Split View
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Mobile View Toggle: 'list' | 'detail'
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");

  // Modals
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [isApplicationsOpen, setIsApplicationsOpen] = useState(false);

  // Toast message
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // Carregar salvos do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sinevagas_saved_jobs");
      if (stored) {
        setSavedJobIds(JSON.parse(stored));
      }
    } catch {
      setSavedJobIds([]);
    }
  }, []);

  const handleToggleSaveJob = (jobId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedJobIds((prev) => {
      let updated: number[];
      if (prev.includes(jobId)) {
        updated = prev.filter((id) => id !== jobId);
        showToast("Vaga removida dos salvos.");
      } else {
        updated = [...prev, jobId];
        showToast("Vaga salva nos seus favoritos.");
      }
      localStorage.setItem("sinevagas_saved_jobs", JSON.stringify(updated));
      return updated;
    });
  };

  // Fetch current user
  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch {
      setUser(null);
    }
  };

  // Fetch jobs
  const fetchJobs = useCallback(async () => {
    setLoadingJobs(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("q", searchQuery);
      if (locationQuery) params.append("location", locationQuery);
      if (selectedType && selectedType !== "Todas" && selectedType !== "Salvas")
        params.append("type", selectedType);

      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        let fetchedJobs: Job[] = data.jobs || [];

        if (onlySaved || selectedType === "Salvas") {
          fetchedJobs = fetchedJobs.filter((j) => savedJobIds.includes(j.id));
        }

        setJobs(fetchedJobs);

        if (fetchedJobs.length > 0) {
          setSelectedJob((prev) => {
            if (!prev) return fetchedJobs[0];
            const found = fetchedJobs.find((j) => j.id === prev.id);
            return found || fetchedJobs[0];
          });
        } else {
          setSelectedJob(null);
        }
      }
    } catch (err) {
      console.error("Erro ao buscar vagas:", err);
    } finally {
      setLoadingJobs(false);
    }
  }, [searchQuery, locationQuery, selectedType, onlySaved, savedJobIds]);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchJobs]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      showToast("Você saiu da sua conta.");
    } catch {
      setUser(null);
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    if (!confirm("Tem certeza que deseja excluir esta vaga?")) return;

    try {
      const res = await fetch(`/api/jobs/${jobId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao excluir vaga");

      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      if (selectedJob?.id === jobId) {
        setSelectedJob(null);
      }
      showToast("Vaga excluída com sucesso.");
    } catch (err: any) {
      alert(err.message || "Falha ao excluir vaga.");
    }
  };

  const handleOpenPostJob = () => {
    if (!user) {
      setAuthTab("login");
      setIsAuthOpen(true);
      showToast("Faça login para publicar uma vaga.");
      return;
    }
    setIsPostJobOpen(true);
  };

  const handleOpenApplications = () => {
    if (!user) {
      setAuthTab("login");
      setIsAuthOpen(true);
      return;
    }
    setIsApplicationsOpen(true);
  };

  const handleShareJob = (jobId: number) => {
    const shareUrl = `${window.location.origin}/?job=${jobId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      showToast("Link copiado para a área de transferência.");
    }
  };

  const contractTypes = ["Todas", "Remoto", "CLT", "PJ", "Híbrido", "Salvas"];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-neutral-900 dark:text-neutral-100 font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors">
      {/* Toast Minimalista */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-neutral-900 text-white dark:bg-white dark:text-black px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 text-xs font-medium border border-neutral-800 dark:border-neutral-200 animate-fadeIn">
          <CheckCircle2 className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-700 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        user={user}
        onOpenAuth={(tab) => {
          if (tab) setAuthTab(tab);
          setIsAuthOpen(true);
        }}
        onOpenPostJob={handleOpenPostJob}
        onOpenApplications={handleOpenApplications}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        {/* Dual Inputs Search & Filter Bar */}
        <div className="mb-6 space-y-4 bg-white dark:bg-black pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-center gap-3">
            {/* Dual Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 flex-1 max-w-3xl">
              {/* Input 1: Vaga / Cargo / Tecnologia */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Vaga, cargo ou tecnologia (ex: Frontend, React)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-3 py-2 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 rounded-full md:rounded-tr-none md:rounded-br-none text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-neutral-200 dark:border-neutral-800 transition-colors"
                />
              </div>

              {/* Input 2: Cidade / Localização */}
              <div className="hidden md:block relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Cidade ou localização (ex: Porto Alegre, Remoto)..."
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full pl-11 pr-3 py-2 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 rounded-tr-full rounded-br-full text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-neutral-200 dark:border-neutral-800 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Toggle Button */}
        {mobileView === "detail" && (
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setMobileView("list")}
              className="inline-flex items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar para a lista</span>
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {loadingJobs && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-3">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-28 bg-neutral-100 dark:bg-neutral-900/60 rounded-xl animate-pulse border border-neutral-200/60 dark:border-neutral-800/60"
                />
              ))}
            </div>
            <div className="hidden lg:block lg:col-span-7">
              <div className="h-[400px] bg-neutral-100 dark:bg-neutral-900/60 rounded-xl animate-pulse border border-neutral-200/60 dark:border-neutral-800/60" />
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loadingJobs && jobs.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-black rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 max-w-md mx-auto">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-900 text-neutral-400 flex items-center justify-center mx-auto mb-3 border border-neutral-200 dark:border-neutral-800">
              <Briefcase className="w-5 h-5 text-neutral-400" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
              Nenhuma vaga encontrada
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-5">
              Tente ajustar os filtros de busca de cargo ou localização.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setLocationQuery("");
                setSelectedType("Todas");
                setOnlySaved(false);
              }}
              className="bg-neutral-900 text-white dark:bg-white dark:text-black text-xs font-medium px-4 py-2 rounded-lg transition-opacity hover:opacity-90"
            >
              Resetar Filtros
            </button>
          </div>
        )}

        {/* Split Screen Layout */}
        {!loadingJobs && jobs.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
            {/* Left Column: Job Stack */}
            <div
              className={`lg:col-span-5 space-y-3 ${
                mobileView === "detail" ? "hidden lg:block" : "block"
              }`}
            >
              {jobs.map((job) => {
                const isSelected = selectedJob?.id === job.id;
                const isSaved = savedJobIds.includes(job.id);

                return (
                  <JobCard
                    key={job.id}
                    job={job}
                    currentUserId={user?.id}
                    isSelected={isSelected}
                    isSaved={isSaved}
                    onSelectJob={(j) => {
                      setSelectedJob(j);
                      setMobileView("detail");
                    }}
                    onApplyJob={(j) => {
                      setSelectedJob(j);
                      setMobileView("detail");
                    }}
                    onToggleSaveJob={handleToggleSaveJob}
                    onDeleteJob={handleDeleteJob}
                  />
                );
              })}
            </div>

            {/* Right Column: Selected Job Detail */}
            <div
              className={`lg:col-span-7 sticky top-20 ${
                mobileView === "list" ? "hidden lg:block" : "block"
              }`}
            >
              <JobDetailPanel
                job={selectedJob}
                currentUser={user}
                isSaved={selectedJob ? savedJobIds.includes(selectedJob.id) : false}
                onOpenAuth={(tab) => {
                  if (tab) setAuthTab(tab);
                  setIsAuthOpen(true);
                  showToast("Faça login para se candidatar.");
                }}
                onSuccessApply={() =>
                  showToast("Candidatura enviada com sucesso.")
                }
                onToggleSave={(jobId) => handleToggleSaveJob(jobId)}
                onShareJob={(jobId) => handleShareJob(jobId)}
              />
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <PostJobModal
        isOpen={isPostJobOpen}
        onClose={() => setIsPostJobOpen(false)}
        onJobCreated={(newJob) => {
          setJobs((prev) => [newJob, ...prev]);
          setSelectedJob(newJob);
          showToast("Vaga publicada com sucesso.");
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        initialTab={authTab}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(u) => {
          setUser(u);
          showToast(`Bem-vindo, ${u.name}.`);
        }}
      />

      <ApplicationsModal
        isOpen={isApplicationsOpen}
        onClose={() => setIsApplicationsOpen(false)}
        userRole={user?.role || "candidate"}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
