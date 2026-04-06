import { motion } from 'framer-motion';
import { CloudRain } from 'lucide-react';

interface LoginCardProps {
  email: string;
  password: string;
  loading: boolean;
  error?: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
}

export function LoginCard({
  email,
  password,
  loading,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      className="w-full max-w-md"
    >
      <div className="relative rounded-3xl overflow-hidden">
        <div className="absolute -inset-1 bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-3xl blur-xl opacity-30" />

        <div className="relative rounded-3xl border border-white/10 bg-black/20 backdrop-blur-xl shadow-2xl">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tl from-white/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-white/15 via-white/5 to-transparent" />

          <div className="relative z-10 p-10">
            <div className="mb-10 text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 15 }}
                className="mb-5 flex items-center justify-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-xl" />
                  <div className="relative flex items-center gap-1 bg-gradient-to-br from-amber-300 to-amber-500 p-3 rounded-2xl">
                    <CloudRain className="h-6 w-6 text-slate-800" />
                  </div>
                </div>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-3xl font-bold text-white tracking-tight"
              >
                Weather insight
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-2 text-sm text-white/60 tracking-wide"
              >
                Weather Insights Platform
              </motion.p>
            </div>

            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              onSubmit={onSubmit}
              className="space-y-6"
            >
              {error && (
                <div className="rounded-xl border border-red-400/40 bg-red-500/20 px-4 py-3 text-sm text-red-100">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white/80">
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => onEmailChange(e.target.value)}
                    className="h-14 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-white placeholder:text-white/40 backdrop-blur-sm transition-all duration-300 focus:border-white/20 focus:bg-white/10 focus:outline-none"
                    required
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-white/80">
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    className="h-14 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-white placeholder:text-white/40 backdrop-blur-sm transition-all duration-300 focus:border-white/20 focus:bg-white/10 focus:outline-none"
                    required
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="h-14 w-full rounded-xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/25 transition-all duration-300 hover:bg-blue-500 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </motion.form>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-center text-sm text-white/50"
            >
              Nao tem uma conta?{' '}
              <a href="/register" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                Cadastre-se
              </a>
            </motion.p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
