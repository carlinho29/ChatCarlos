import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (isLogin: boolean, e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) {
      setMessage(error.message);
    } else if (!isLogin) {
      setMessage('Cadastro efetuado! Verifique seu e-mail se for necessario confirmar.');
    }
    setLoading(false);
  };

  const handleGitHub = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'github' });
  };

  return (
    <div className="app-container">
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div className="auth-card">
          <h1 className="title-primary">Carlos</h1>
          
          <form onSubmit={(e) => handleAuth(true, e)}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>E-mail</label>
            <input
              type="email"
              required
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Senha</label>
            <input
              type="password"
              required
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {message && <p style={{ fontSize: '0.875rem', color: '#dc2626', marginBottom: '1rem' }}>{message}</p>}

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Aguarde...' : 'Entrar'}
            </button>
            <button type="button" onClick={(e) => handleAuth(false, e)} disabled={loading} className="btn-secondary">
              Cadastrar
            </button>
          </form>

          <div style={{ margin: '1.5rem 0', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>ou</div>

          <button onClick={handleGitHub} className="btn-secondary" style={{ color: '#374151', borderColor: '#d1d5db' }}>
            Entrar com GitHub
          </button>
        </div>
      </div>

      <footer className="footer-credits">
        Desenvolvido por David Delgado
      </footer>
    </div>
  );
}
