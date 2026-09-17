'use client';

import React from 'react';
import { Search, MapPin, Filter, Sparkles, Building, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  totalJobsCount: number;
}

export function HeroSection({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  totalJobsCount,
}: HeroSectionProps) {
  const contractTypes = ['Todas', 'Remoto', 'CLT', 'PJ', 'Híbrido'];

  return (
    <div className="relative overflow-hidden bg-white dark:bg-black text-neutral-900 dark:text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      {/* Background Glow Overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-blue-600/10 via-indigo-500/10 to-purple-500/0 blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-neutral-900 border border-blue-200 dark:border-neutral-800 text-blue-600 dark:text-blue-400 text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Sua próxima conquista profissional está aqui</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-6 leading-tight">
          Conectando os Melhores <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
            Talentos às Melhores Vagas
          </span>
        </h1>

        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Publique oportunidades de emprego ou encontre a vaga perfeita para alavancar sua carreira. Transparência, facilidade e agilidade.
        </p>

        {/* Interactive Search Box */}
        <div className="max-w-3xl mx-auto bg-neutral-100/80 dark:bg-neutral-900/90 p-2 sm:p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Cargo, tecnologia, palavra-chave ou empresa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-black text-neutral-900 dark:text-white placeholder-neutral-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-neutral-200 dark:border-neutral-800 shadow-inner"
              />
            </div>

            {/* Filter Badge indicator */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="hidden sm:flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400 px-3">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>Brasil</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contract Type Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtro:</span>
          </div>

          {contractTypes.map((type) => {
            const isSelected = selectedType === type;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-105'
                    : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>

        {/* Live Counters */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-8 border-t border-neutral-200 dark:border-neutral-800 text-left">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-neutral-900 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-neutral-800">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">{totalJobsCount}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Vagas Ativas</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-neutral-900 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-neutral-800">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">100%</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Gratuito</p>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-neutral-900 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-neutral-800">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-neutral-900 dark:text-white">Direto</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Com o Recrutador</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
