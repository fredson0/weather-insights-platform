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
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Insights de IA</h1>
              <p className="text-gray-600 mt-1">Análises e previsões geradas por Google Gemini</p>
            </div>
            <button
              onClick={handleGenerateInsight}
              disabled={generating}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? 'Gerando...' : '✨ Gerar Novo Insight'}
            </button>
          </div>

          {/* Insights Grid */}
          {insights.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum insight gerado ainda</h3>
              <p className="text-gray-600 mb-6">Clique em "Gerar Novo Insight" para criar análises com IA</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {insights.map((insight) => (
                <div key={insight.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(insight.type)}`}>
                      {getTypeIcon(insight.type)} {insight.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(insight.createdAt), 'dd/MM HH:mm')}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {insight.title}
                  </h3>
                  
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                    {insight.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
