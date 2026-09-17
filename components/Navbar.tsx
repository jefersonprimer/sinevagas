"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  PlusCircle,
  LogIn,
  LogOut,
  User as UserIcon,
  FileText,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  X,
  MapPin,
  Briefcase,
  Target,
  FileCheck,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export interface User {
  id: number;
  name: string;
  last_name?: string;
  email: string;
  role: "candidate" | "recruiter";
  avatar_url?: string;
  employment_status?: string;
  location?: string;
  resume_url?: string;
  preferred_role?: string;
  expected_salary?: string;
  preferred_contract?: string;
  professional_summary?: string;
}

interface NavbarProps {
  user: User | null;
  onOpenAuth: (initialTab?: "login" | "register") => void;
  onOpenPostJob: () => void;
  onOpenApplications: () => void;
  onLogout: () => void;
}

export function Navbar({
  user,
  onOpenAuth,
  onOpenPostJob,
  onOpenApplications,
  onLogout,
}: NavbarProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  useEffect(() => {
    // Inicializar tema com base no localStorage ou preferência do sistema
    const savedTheme = localStorage.getItem("theme");
    const isDark =
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (isDark) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Fechar modal com a tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsUserModalOpen(false);
      }
    };
    if (isUserModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isUserModalOpen]);

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      setTheme("dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  const fullName = user ? `${user.name} ${user.last_name || ""}`.trim() : "";

  return (
    <>
      {/* Faixa com as cores oficiais da bandeira do Rio Grande do Sul (Verde, Vermelho, Amarelo) */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-red-600 to-amber-400" />

      <header className="sticky top-0 z-40 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800/80 transition-colors shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo & Name (Representando o Rio Grande do Sul) */}
          <Link href="/" className="flex items-center gap-3 group">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.webp"
                alt="Brasão do Rio Grande do Sul - SineVagas"
                className="h-10 w-auto object-contain drop-shadow-sm"
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-sans">
                  Sine
                  <span className="text-emerald-600 dark:text-emerald-400">
                    Vagas
                  </span>
                </span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700/80 dark:text-emerald-400/80 tracking-wider uppercase">
                Frederico Westphalen
              </span>
            </div>
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                {/* Publicar Vaga Button (Primary CTA) */}
                <button
                  onClick={onOpenPostJob}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-md shadow-xs hover:shadow-md shadow-emerald-600/20 transition-all active:scale-[0.98]"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Publicar Vaga</span>
                  <span className="sm:hidden">Vaga</span>
                </button>

                <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800 mx-1 hidden sm:block" />

                {/* User Modal Trigger Button */}
                <button
                  onClick={() => setIsUserModalOpen(true)}
                  className="flex items-center gap-2.5 bg-neutral-100/90 dark:bg-neutral-900 hover:bg-emerald-50 dark:hover:bg-neutral-800/90 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all group"
                  title="Abrir informações do Usuário"
                >
                  <div className="relative">
                    {user.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.avatar_url}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover border border-emerald-500/50"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-900" />
                  </div>

                  <div className="text-left hidden md:block">
                    <p className="text-xs font-bold text-neutral-800 dark:text-neutral-100 leading-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors truncate max-w-[120px]">
                      {user.name}
                    </p>
                  </div>

                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-600 transition-colors" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenPostJob}
                  className="hidden sm:flex items-center gap-2 text-sm font-normal text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-3.5 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-600" />
                  <span>Anunciar Vaga</span>
                </button>

                <button
                  onClick={() => onOpenAuth("login")}
                  className="flex items-center gap-1.5 text-sm font-normal text-neutral-700 dark:text-neutral-200 hover:text-emerald-600 dark:hover:text-emerald-400 px-3.5 py-2 rounded-md border border-neutral-300 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Entrar</span>
                </button>

                <button
                  onClick={() => onOpenAuth("register")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-normal px-4 py-2 rounded-md shadow-xs hover:shadow transition-all"
                >
                  Cadastrar
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* MODAL DO USUÁRIO (USER QUICK INFO DROPDOWN BELOW HEADER)  */}
      {/* ========================================================= */}
      {user && isUserModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Overlay transparente para fechar ao clicar fora */}
          <div
            className="fixed inset-0 bg-transparent"
            onClick={() => setIsUserModalOpen(false)}
          />

          {/* Dropdown Card de Perfil Minimalista e Clean */}
          <div className="absolute top-16 right-4 sm:right-6 lg:right-8 mt-2 w-72 sm:w-80 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 rounded-xl shadow-xl shadow-black/10 dark:shadow-black/40 overflow-hidden z-50 animate-scaleUp">
            <div className="p-3 space-y-1 relative">
              {/* Profile Card Header */}
              <div className="p-3 bg-neutral-50/80 dark:bg-neutral-950/50 rounded-xl border border-neutral-100 dark:border-neutral-800/80 mb-2">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-base border border-emerald-500/30 shadow-xs">
                      {user.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.avatar_url}
                          alt={fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{user.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white truncate leading-snug">
                      {fullName}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Links */}
              <div className="space-y-0.5">
                {/* Meu Perfil */}
                <Link
                  href="/perfil"
                  onClick={() => setIsUserModalOpen(false)}
                  className="group flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/70 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <UserIcon className="w-5 h-5 text-neutral-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                    <span>Meu Perfil</span>
                  </div>
                  {user.role === "candidate" && !user.resume_url ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200/80 dark:border-amber-900/50">
                      <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>Anexar CV</span>
                    </span>
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                  )}
                </Link>

                {/* Ver Minhas Candidaturas */}
                <button
                  onClick={() => {
                    setIsUserModalOpen(false);
                    onOpenApplications();
                  }}
                  className="group w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/70 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-neutral-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                    <span>
                      {user.role === "recruiter"
                        ? "Candidaturas Recebidas"
                        : "Minhas Candidaturas"}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </button>

                {/* Publicar Nova Vaga */}
                <button
                  onClick={() => {
                    setIsUserModalOpen(false);
                    onOpenPostJob();
                  }}
                  className="group w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/70 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <PlusCircle className="w-5 h-5 text-neutral-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                    <span>Publicar Nova Vaga</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </button>
              </div>

              {/* Separador */}
              <div className="my-1.5 h-px bg-neutral-100 dark:bg-neutral-800/80 mx-1" />

              {/* Alternar Tema (Modo Claro / Escuro) */}
              <button
                onClick={toggleTheme}
                className="group w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/70 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5 text-amber-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-slate-600 dark:text-neutral-400" />
                  )}
                  <span>Modo {theme === "dark" ? "Claro" : "Escuro"}</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                  {theme === "dark" ? "Escuro" : "Claro"}
                </span>
              </button>

              {/* Separador */}
              <div className="my-1.5 h-px bg-neutral-100 dark:bg-neutral-800/80 mx-1" />

              {/* Logout Button */}
              <button
                onClick={() => {
                  setIsUserModalOpen(false);
                  onLogout();
                }}
                className="group w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <LogOut className="w-5 h-5  text-rose-500 dark:text-rose-400 group-hover:scale-105 transition-transform" />
                <span>Sair da conta</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
