import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Cloud, Droplets, Thermometer, Wind } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '@/core/api/axios';
import { WeatherData } from '@/shared/types';
import { Navbar } from '@/shared/components/Navbar';

export function DashboardPage() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      const response = await api.get<WeatherData[]>('/weather?limit=50');
      setWeatherData(response.data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'csv' | 'xlsx') => {
    try {
      const response = await api.get(`/weather/export/${format}`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `weather-data.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erro ao exportar:', error);
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

  const latestWeather = weatherData[0];
  const totalPoints = weatherData.length;
  const chartData = weatherData.slice(0, 20).reverse().map(item => ({
    time: format(new Date(item.timestamp), 'HH:mm'),
    temperatura: item.temperature,
    umidade: item.humidity,
    vento: item.windSpeed,
  }));

  const avgHumidity = totalPoints > 0 ? weatherData.reduce((sum, d) => sum + d.humidity, 0) / totalPoints : 0;
  const maxTemp = totalPoints > 0 ? Math.max(...weatherData.map((d) => d.temperature)) : 0;
  const minTemp = totalPoints > 0 ? Math.min(...weatherData.map((d) => d.temperature)) : 0;

  const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));
  const cloudRisk = latestWeather ? clamp(latestWeather.cloudCover ?? 0) : 0;
  const humidityRisk = latestWeather ? clamp(latestWeather.humidity) : 0;
  const windRisk = latestWeather ? clamp((latestWeather.windSpeed / 35) * 100) : 0;
  const rainRisk = latestWeather ? clamp((latestWeather.precipitation / 20) * 100) : 0;
  const riskScore = Math.round((cloudRisk * 0.35) + (humidityRisk * 0.3) + (windRisk * 0.25) + (rainRisk * 0.1));
  const riskLabel = riskScore >= 70 ? 'Alto' : riskScore >= 40 ? 'Moderado' : 'Baixo';

  const latitude = latestWeather?.latitude ?? -12.9714;
  const longitude = latestWeather?.longitude ?? -38.5014;
  const areaDotX = clamp(((longitude + 180) / 360) * 100, 8, 92);
  const areaDotY = clamp((1 - ((latitude + 90) / 180)) * 100, 8, 92);

  return (
    <div className="min-h-screen bg-[#0b0f16] text-white">
      <Navbar />
      <div className="relative">
        <div className="absolute inset-0 bg-[url('/dashboard-bg.png.png')] bg-[length:115%_115%] bg-[position:40%_50%] opacity-90 animate-[dashboard-drift_28s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f16]/30 via-[#0b0f16]/70 to-[#0b0f16]" />
        <div className="relative z-10 w-full px-8 sm:px-10 lg:px-12 py-14">
          <div className="mx-auto max-w-[1500px]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">Salvador, Bahia, BR · {format(new Date(), 'EEEE, d \'de\' MMMM', { locale: ptBR })}</p>
                <div className="mt-5 flex items-end gap-4">
                  <h1 className="text-6xl font-semibold tracking-tight">
                    {latestWeather ? `${latestWeather.temperature.toFixed(0)}°` : '18°'}
                  </h1>
                  <div className="flex items-center gap-2 pb-3 text-xs text-white/70">
                    <span className="rounded-full border border-white/15 bg-white/10 px-2 py-1">H {maxTemp.toFixed(0)}°</span>
                    <span className="rounded-full border border-white/15 bg-white/10 px-2 py-1">L {minTemp.toFixed(0)}°</span>
                  </div>
                </div>
                <div className="mt-3 text-3xl text-white/85">
                  {latestWeather?.condition || 'Stormy'}
                </div>
                <p className="mt-1 text-lg text-white/60">{latestWeather?.location || 'Salvador, BA'}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleExport('csv')}
                  className="rounded-full border border-emerald-400/40 bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-100 backdrop-blur transition hover:bg-emerald-500/30"
                >
                  Exportar CSV
                </button>
                <button
                  onClick={() => handleExport('xlsx')}
                  className="rounded-full border border-sky-400/40 bg-sky-500/20 px-4 py-2 text-sm font-medium text-sky-100 backdrop-blur transition hover:bg-sky-500/30"
                >
                  Exportar Excel
                </button>
              </div>
            </div>

            <div className="mt-16 relative">
              <div className="absolute left-0 top-0 w-[280px] lg:-left-48">
                <div className="rounded-[28px] border border-white/10 bg-white/10 p-7 backdrop-blur-xl">
                  <div className="text-sm font-medium text-white/70">WeatherWise</div>

                  <div className="mt-6">
                    <div className="text-xs text-white/50">Status</div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="rounded-full border border-emerald-300/40 bg-emerald-400/20 px-3 py-1 text-sm text-emerald-200">
                        {avgHumidity.toFixed(0)}%
                      </div>
                      <div className="text-xs text-white/50">Humidity</div>
                    </div>
                    <div className="mt-5 rounded-2xl bg-white/5 px-4 py-3">
                      <div className="flex items-center justify-between text-xs text-white/50">
                        <span>Risco</span>
                        <span>{riskLabel}</span>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 transition-all duration-700"
                          style={{ width: `${riskScore}%` }}
                        />
                      </div>
                      <div className="mt-2 text-[11px] text-white/45">Indice: {riskScore}%</div>
                    </div>
                    <button className="mt-4 text-xs text-white/50 hover:text-white/70">Ver mais detalhes</button>
                  </div>

                  <div className="mt-8 border-t border-white/10 pt-6">
                    <div className="text-xs text-white/50">Selecionar area</div>
                    <div className="mt-5 flex items-center justify-center">
                      <div className="relative h-40 w-40 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-400/20">
                        <div className="absolute inset-4 rounded-full border border-white/10" />
                        <div className="absolute inset-10 rounded-full border border-white/10" />
                        <div
                          className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.85)]"
                          style={{ left: `${areaDotX}%`, top: `${areaDotY}%` }}
                        />
                      </div>
                    </div>
                    <div className="mt-5 text-xs text-white/50">
                      {latestWeather?.location || 'Salvador, BA, BR'} · {latitude.toFixed(2)}, {longitude.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-12 lg:grid-cols-1 lg:pl-[260px] lg:pr-[260px]">
                <div className="space-y-12">
                  <div className="grid gap-10 md:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
                      <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Temperatura (ultimas horas)</h2>
                        <span className="text-xs text-white/50">{chartData.length} pontos</span>
                      </div>
                      <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="tempGlow" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.45} />
                              <stop offset="100%" stopColor="#fbbf24" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
                          <XAxis dataKey="time" stroke="rgba(255,255,255,0.45)" tickLine={false} axisLine={false} />
                          <YAxis hide />
                          <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }} />
                          <Area type="monotone" dataKey="temperatura" stroke="#fbbf24" strokeWidth={2.5} fill="url(#tempGlow)" dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
                      <h2 className="mb-4 text-lg font-semibold">Umidade (ultimas horas)</h2>
                      <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                          <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
                          <YAxis stroke="rgba(255,255,255,0.5)" />
                          <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }} />
                          <Line type="monotone" dataKey="umidade" stroke="#60a5fa" strokeWidth={2} dot={false} name="Umidade (%)" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-xl">
                    <h2 className="mb-4 text-lg font-semibold">Velocidade do Vento</h2>
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                        <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
                        <YAxis stroke="rgba(255,255,255,0.5)" />
                        <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)' }} />
                        <Bar dataKey="vento" fill="#34d399" name="Vento (km/h)" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

          </div>

          <div className="absolute right-6 top-[240px] flex flex-col items-end space-y-10">
              <div className="w-full max-w-[320px]">
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm text-white/60">
                    <span>Salvador, BA</span>
                    <span className="text-white/50">Ao vivo</span>
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {latestWeather && (
                      <>
                        <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm backdrop-blur">
                          <div className="flex items-start justify-between">
                            <Thermometer className="h-6 w-6 text-white/70" />
                            <span className="text-white text-2xl leading-none">{latestWeather.temperature.toFixed(0)}°</span>
                          </div>
                          <div className="mt-3 text-white/80 text-sm">Temperatura</div>
                          <div className="text-xs text-white/50">Salvador, BA</div>
                        </div>

                        <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm backdrop-blur">
                          <div className="flex items-start justify-between">
                            <Droplets className="h-6 w-6 text-white/70" />
                            <span className="text-white text-2xl leading-none">{latestWeather.humidity.toFixed(0)}%</span>
                          </div>
                          <div className="mt-3 text-white/80 text-sm">Umidade</div>
                          <div className="text-xs text-white/50">Salvador, BA</div>
                        </div>

                        <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm backdrop-blur">
                          <div className="flex items-start justify-between">
                            <Wind className="h-6 w-6 text-white/70" />
                            <span className="text-white text-2xl leading-none">{latestWeather.windSpeed.toFixed(1)}</span>
                          </div>
                          <div className="mt-3 text-white/80 text-sm">Vento (km/h)</div>
                          <div className="text-xs text-white/50">Salvador, BA</div>
                        </div>

                        <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm backdrop-blur">
                          <div className="flex items-start justify-between">
                            <Cloud className="h-6 w-6 text-white/70" />
                            <span className="text-white text-base">{latestWeather.condition}</span>
                          </div>
                          <div className="mt-3 text-white/80 text-sm">Condição</div>
                          <div className="text-xs text-white/50">{format(new Date(latestWeather.timestamp), 'HH:mm')}</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
