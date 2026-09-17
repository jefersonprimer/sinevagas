"use client";

import React, { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "login" | "register";
  onSuccess: (user: any) => void;
}

export function AuthModal({
  isOpen,
  onClose,
  initialTab = "login",
  onSuccess,
}: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">(initialTab);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"candidate" | "recruiter">("candidate");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const endpoint =
        tab === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload =
        tab === "login" ? { email, password } : { name, email, password, role };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Ocorreu um erro.");
      }

      onSuccess(data.user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao processar autenticação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header Tabs */}
        <div className="bg-slate-100 dark:bg-slate-800 p-1.5 flex items-center gap-1 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => {
              setTab("login");
              setErrorMsg("");
            }}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all flex items-center justify-center ${
              tab === "login"
                ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span>Entrar na Conta</span>
          </button>

          <button
            onClick={() => {
              setTab("register");
              setErrorMsg("");
            }}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all flex items-center justify-center ${
              tab === "register"
                ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span>Criar Cadastro</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-center mb-2">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {tab === "login"
                ? "Bem-vindo de volta!"
                : "Crie sua conta no SineVagas"}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {tab === "login"
                ? "Insira seus dados abaixo para acessar sua conta"
                : "Escolha se você é candidato ou contratante"}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 text-sm bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 rounded-md border border-rose-200 dark:border-rose-900">
              {errorMsg}
            </div>
          )}

          {tab === "register" && (
            <>
              {/* Role Selection */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setRole("candidate")}
                  className={`py-2 px-3 rounded-md text-sm font-semibold flex items-center justify-center transition-all ${
                    role === "candidate"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  <span>Sou Candidato</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("recruiter")}
                  className={`py-2 px-3 rounded-md text-sm font-semibold flex items-center justify-center transition-all ${
                    role === "recruiter"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  <span>Sou Recrutador</span>
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Endereço de E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 pr-10 text-sm bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                aria-label={showPassword ? "Ocultar senha" : "Exibir senha"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-semibold py-3 rounded-md shadow-md transition-all flex items-center justify-center"
          >
            <span>
              {loading
                ? "Aguarde..."
                : tab === "login"
                  ? "Entrar no Sistema"
                  : "Finalizar Cadastro"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
