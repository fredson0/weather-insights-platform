import { useState, useEffect } from 'react';
import api from '@/core/api/axios';
import { Insight } from '@/shared/types';
import { Navbar } from '@/shared/components/Navbar';
import { format } from 'date-fns';

export function ExplorePage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const response = await api.get<Insight[]>('/insights?limit=10');
      console.log('📊 Insights recebidos da API:', response.data);
      setInsights(response.data);
    } catch (error) {
      console.error('Erro ao buscar insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInsight = async () => {
    try {
      setGenerating(true);
      await api.post('/insights/generate', {
        location: 'Salvador, BA'
      });
      await fetchInsights();
    } catch (error) {
      console.error('Erro ao gerar insight:', error);
    } finally {
      setGenerating(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'trend_prediction':
        return 'bg-blue-100 text-blue-800';
      case 'weather_analysis':
        return 'bg-green-100 text-green-800';
      case 'recommendation':
        return 'bg-purple-100 text-purple-800';
      case 'anomaly_detection':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'trend_prediction':
        return '🔮';
      case 'weather_analysis':
        return '📊';
      case 'recommendation':
        return '💡';
      case 'anomaly_detection':
        return '⚠️';
      default:
        return '📝';
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-[#0b0f16]">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-white/60"></div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f16] text-white">
      <Navbar />
      <div className="relative">
        <div className="absolute inset-0 bg-[url('/dashboard-bg.png.png')] bg-[length:115%_115%] bg-[position:40%_50%] opacity-90 animate-[dashboard-drift_28s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f16]/30 via-[#0b0f16]/70 to-[#0b0f16]" />
        <div className="relative z-10 w-full px-8 sm:px-10 lg:px-12 py-14">
        <div className="mx-auto max-w-[1500px]">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-white">Insights de IA</h1>
              <p className="mt-2 text-white/70">Análises e previsões geradas por Google Gemini</p>
            </div>
            <button
              onClick={handleGenerateInsight}
              disabled={generating}
              className="rounded-full border border-sky-400/40 bg-sky-500/20 px-5 py-2 text-sm font-medium text-sky-100 backdrop-blur transition hover:bg-sky-500/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generating ? 'Gerando...' : '✨ Gerar Novo Insight'}
            </button>
          </div>

          {/* Insights Grid */}
          {insights.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/10 p-12 text-center backdrop-blur-xl">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="mb-2 text-xl font-semibold text-white">Nenhum insight gerado ainda</h3>
              <p className="mb-6 text-white/70">Clique em "Gerar Novo Insight" para criar análises com IA</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {insights.map((insight) => (
                <div key={insight.id} className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl transition hover:bg-white/15">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(insight.type)}`}>
                      {getTypeIcon(insight.type)} {insight.type}
                    </span>
                    <span className="text-xs text-white/60">
                      {format(new Date(insight.createdAt), 'dd/MM HH:mm')}
                    </span>
                  </div>
                  
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    {insight.title}
                  </h3>
                  
                  <p className="whitespace-pre-line text-sm leading-relaxed text-white/80">
                    {insight.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
