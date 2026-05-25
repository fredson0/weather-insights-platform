import React from 'react';
import Hero, { ShaderBackground } from '@/shared/components/ui/animated-shader-hero';

const LandingPage: React.FC = () => {
  const handleGetStarted = () => {
    // navigar para /login ou abrir modal
    window.location.href = '/login';
  };

  return (
    <div className="relative w-full min-h-screen text-white overflow-hidden bg-[#f6f1e9]">
      <ShaderBackground />
      <Hero
        trustBadge={{ text: 'Dados meteorológicos reais • Insights em tempo real', icons: ['🌦️'] }}
        headline={{ line1: 'Weather', line2: 'Insights' }}
        subtitle="Painel de monitoramento e alertas climáticos — dados reais, exportações CSV/XLSX e visualizações interativas."
        buttons={{
          primary: { text: 'Fazer login', onClick: handleGetStarted },
          secondary: { text: 'Saiba mais', onClick: () => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' }) }
        }}
      />

      {/* Segunda seção: login */}
      <section className="relative z-20 pt-24 pb-36">
        <div className="mx-auto max-w-6xl px-6 min-h-[720px] flex items-center">
          <div
            className="relative overflow-hidden rounded-[32px] border border-white/10 shadow-2xl"
            style={{
              backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.93), rgba(255,255,255,0.86)), url('https://images.unsplash.com/photo-1428592953211-077101b2021b?auto=format&fit=crop&w=1600&q=80')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-10 lg:p-14 text-slate-900">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-orange-600 font-semibold mb-3">Visao geral</p>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">Sobre o Weather Insights</h2>
                <p className="mb-6 text-slate-700 leading-relaxed">
                  A plataforma agrega dados de estacoes e coletores para fornecer paineis, previsoes e indicadores de risco climatico por localizacao.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white/80 border border-slate-200 p-4">
                    <p className="text-sm font-semibold">Coleta inteligente</p>
                    <p className="text-sm text-slate-600 mt-1">Agentes e filas (RabbitMQ) com ingestao automatica.</p>
                  </div>
                  <div className="rounded-2xl bg-white/80 border border-slate-200 p-4">
                    <p className="text-sm font-semibold">Dados confiaveis</p>
                    <p className="text-sm text-slate-600 mt-1">Armazenamento seguro em MongoDB.</p>
                  </div>
                  <div className="rounded-2xl bg-white/80 border border-slate-200 p-4">
                    <p className="text-sm font-semibold">Exportacoes rapidas</p>
                    <p className="text-sm text-slate-600 mt-1">CSV e Excel prontos para analise.</p>
                  </div>
                  <div className="rounded-2xl bg-white/80 border border-slate-200 p-4">
                    <p className="text-sm font-semibold">Alertas visuais</p>
                    <p className="text-sm text-slate-600 mt-1">Graficos e indicadores em tempo real.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="w-full max-w-md rounded-2xl bg-slate-900/95 border border-slate-700/40 p-8 text-white shadow-xl">
                  <h3 className="text-2xl font-semibold">Acesse o painel</h3>
                  <p className="mt-3 text-white/70">
                    Entre com sua conta para visualizar dados, alertas e exportacoes. Se nao tiver conta, voce pode criar uma na tela de login.
                  </p>
                  <a
                    href="/login"
                    className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-orange-500 px-4 py-3 font-semibold text-black transition-colors hover:bg-orange-600"
                  >
                    Entrar no projeto
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
