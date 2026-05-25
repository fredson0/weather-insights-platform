import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/core/contexts/AuthContext';
import { ShaderBackground } from '@/shared/components/ui/animated-shader-hero';
import { LoginCard } from '@/shared/components/LoginCard';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent">
      <ShaderBackground />
      <div className="pointer-events-none absolute inset-0 z-10 bg-slate-950/35" />
      <div className="relative z-20 flex w-full items-center justify-center p-4">
        <LoginCard
          email={email}
          password={password}
          loading={loading}
          error={error}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
