"use client";

import React from "react";
import { MapPin, Mail, Clock, ExternalLink, Map, Phone } from "lucide-react";

function FacebookIcon({
  className = "w-4 h-4 fill-current",
}: {
  className?: string;
}) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Facebook</title>
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
    </svg>
  );
}

function InstagramIcon({
  className = "w-4 h-4 fill-current",
}: {
  className?: string;
}) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Instagram</title>
      <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077" />
    </svg>
  );
}

export function Footer() {
  const mapsPortoAlegre =
    "https://www.google.com/maps/search/?api=1&query=Av+Borges+de+Medeiros+521+Centro+Historico+Porto+Alegre+RS+90020-023";
  const mapsFredericoWestphalen =
    "https://www.google.com.br/maps/place/Rua+Monsenhor+Vitor+Batistela%2C+576+-+Frederico+Westphalen+-+RS+-+Brasil+-+98400-000/@-27.3545841,-53.39538289999996";
  const facebookFredericoUrl =
    "https://pt-br.facebook.com/pages/FgtasSine-Frederico-Westphalen/1463975087178279";
  const instagramFredericoUrl = "https://www.instagram.com/fgtassinefw/";

  return (
    <footer className="w-full bg-white dark:bg-neutral-950 text-neutral-600 dark:text-neutral-300 border-t border-neutral-200/80 dark:border-neutral-800/80 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Coluna 1: Marca & Brasão (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="p-2.5 bg-emerald-950 dark:bg-neutral-900 rounded-2xl border border-emerald-900/60 dark:border-neutral-800 shrink-0 shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brasao_RS_contraste.png"
                  alt="Brasão do Rio Grande do Sul"
                  className="h-20 sm:h-24 w-auto object-contain drop-shadow-sm"
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white font-sans">
                    Sine
                    <span className="text-emerald-600 dark:text-emerald-500">
                      Vagas
                    </span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-300/60 dark:border-emerald-800/60">
                    RS
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-0.5">
                  Frederico Westphalen • FGTAS/SINE
                </p>
              </div>
            </div>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Promovendo a inserção no mercado de trabalho, a qualificação
              profissional e o apoio aos trabalhadores e empregadores gaúchos.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <a
                href={facebookFredericoUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook FGTAS Sine"
                className="p-2.5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-[#1877F2] dark:hover:bg-[#1877F2] hover:border-[#1877F2] dark:hover:border-[#1877F2] hover:text-white dark:hover:text-white transition-all duration-200 group"
              >
                <FacebookIcon className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
              </a>
              <a
                href={instagramFredericoUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram FGTAS Sine"
                className="p-2.5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-[#E4405F] dark:hover:bg-[#E4405F] hover:border-[#E4405F] dark:hover:border-[#E4405F] hover:text-white dark:hover:text-white transition-all duration-200 group"
              >
                <InstagramIcon className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Coluna 2: Agência Frederico Westphalen (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Agência Frederico Westphalen</span>
            </h4>

            <div className="text-xs text-neutral-500 dark:text-neutral-400 space-y-2.5 pl-3.5 border-l border-neutral-200 dark:border-neutral-800">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-neutral-400 dark:text-neutral-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-neutral-800 dark:text-neutral-200 font-medium">
                    Rua Monsenhor Vitor Batistela, 576
                  </p>
                  <p className="text-neutral-500 dark:text-neutral-400">
                    Frederico Westphalen - RS, 98400-000
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-neutral-400 dark:text-neutral-500 shrink-0 mt-0.5" />
                <div className="flex items-center gap-2">
                  <a
                    href="tel:55981280012"
                    className="text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    (55) 98128.0012
                  </a>
                  <span className="text-neutral-400 dark:text-neutral-600">
                    •
                  </span>
                  <a
                    href="tel:55984231021"
                    className="text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    (55) 98423.1021
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-neutral-400 dark:text-neutral-500 shrink-0 mt-0.5" />
                <a
                  href="mailto:fredericow@fgtas.rs.gov.br"
                  className="text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  fredericow@fgtas.rs.gov.br
                </a>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-neutral-400 dark:text-neutral-500 shrink-0 mt-0.5" />
                <span className="text-neutral-700 dark:text-neutral-300">
                  Atendimento: 8h às 16h
                </span>
              </div>

              <div className="pt-1">
                <a
                  href={mapsFredericoWestphalen}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-medium transition-colors group"
                >
                  <Map className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500 group-hover:scale-105 transition-transform" />
                  <span>Ver no Mapa</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
                </a>
              </div>
            </div>
          </div>

          {/* Coluna 3: Sede Central Porto Alegre (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-200 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500" />
              <span>Sede Central — Porto Alegre</span>
            </h4>

            <div className="text-xs text-neutral-500 dark:text-neutral-400 space-y-2.5 pl-3.5 border-l border-neutral-200 dark:border-neutral-800">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-neutral-400 dark:text-neutral-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-neutral-800 dark:text-neutral-200 font-medium">
                    Av. Borges de Medeiros, 521
                  </p>
                  <p className="text-neutral-500 dark:text-neutral-400">
                    Centro Histórico — Porto Alegre - RS, 90020-023
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-neutral-400 dark:text-neutral-500 shrink-0 mt-0.5" />
                <a
                  href="mailto:fgtas@fgtas.rs.gov.br"
                  className="text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  fgtas@fgtas.rs.gov.br
                </a>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-neutral-400 dark:text-neutral-500 shrink-0 mt-0.5" />
                <span className="text-neutral-700 dark:text-neutral-300">
                  Horário: 8h30 às 12h | 13h30 às 17h
                </span>
              </div>

              <div className="pt-1">
                <a
                  href={mapsPortoAlegre}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-medium transition-colors group"
                >
                  <Map className="w-3.5 h-3.5 text-neutral-500 group-hover:scale-105 transition-transform" />
                  <span>Ver Mapa Sede</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé inferior */}
        <div className="mt-12 pt-6 border-t border-neutral-200 dark:border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400 dark:text-neutral-500">
          <p>
            © {new Date().getFullYear()} Fundação Gaúcha do Trabalho e Ação
            Social — FGTAS. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-3 text-[11px]">
            <span>SineVagas RS</span>
            <span>•</span>
            <a
              href="https://primerlabs.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-700 dark:hover:text-neutral-400 transition-colors"
            >
              Desenvolvido por PrimerLabs
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
