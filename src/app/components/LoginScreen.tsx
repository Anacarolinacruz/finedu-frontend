import loginScene from './login-piggy-scene.png';
import { useState } from 'react';
import { Mail, Lock, BookOpen, Target, Trophy, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import { login, type User } from '../services/api';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  onSignup: () => void;
  onForgotPassword: () => void;
}

export default function LoginScreen({
  onLogin,
  onSignup,
  onForgotPassword,
}: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    if (!email.trim() || !password) {
      setError('Informe o e-mail e a senha');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const user = await login(email.trim(), password);
      onLogin(user);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível realizar o login',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-finance" style={{ backgroundImage: `url(${loginScene})` }}>
      <header className="login-top">
        <div className="login-logo"><BookOpen aria-hidden="true"/><span>Fin<span>Edu</span></span></div>
        <p>Educação financeira<br/>para o seu futuro.</p>
        <span className="login-values">Conhecimento <i/> Disciplina <i/> Liberdade</span>
      </header>
      <main className="login-content">
        <section className="login-story" aria-label="Educação financeira FinEdu">
          <h1>Pequenos passos.<br/><span>Grandes conquistas.</span></h1>
          <p>Aprenda a cuidar do seu dinheiro e<br/> transforme seus planos em metas.</p>
          <div className="login-benefits">
            <div><BookOpen aria-hidden="true"/><h2>Aprenda</h2><p>Conteúdos práticos<br/>para o seu dia a dia.</p></div>
            <div><Target aria-hidden="true"/><h2>Planeje</h2><p>Organize suas finanças<br/>e defina suas metas.</p></div>
            <div><Trophy aria-hidden="true"/><h2>Conquiste</h2><p>Dê vida aos seus<br/>maiores planos.</p></div>
          </div>
        </section>
        <section className="login-card" aria-labelledby="login-heading">
          <h2 id="login-heading">Bem-vindo de volta!</h2>
          <p>Continue sua jornada de educação financeira.</p>
          <div className="login-fields">
            <label htmlFor="login-email">E-mail</label>
            <div className="login-input"><Mail aria-hidden="true"/><input id="login-email" type="email" placeholder="voce@exemplo.com" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" disabled={loading}/></div>
            <label htmlFor="login-password">Senha</label>
            <div className="login-input"><Lock aria-hidden="true"/><input id="login-password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" disabled={loading}/><button type="button" className="login-show" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} disabled={loading}>{showPassword ? <EyeOff/> : <Eye/>}</button></div>
            <button type="button" onClick={onForgotPassword} disabled={loading} className="login-forgot">Esqueci minha senha</button>
          </div>
          {error && <p role="alert" className="login-error">{error}</p>}
          <motion.button type="button" whileTap={{ scale: 0.98 }} onClick={handleLogin} disabled={loading} className="login-submit">{loading ? 'Entrando...' : 'Entrar'}</motion.button>
          <p className="login-signup">Não tem uma conta? <button type="button" onClick={onSignup} disabled={loading}>Criar conta</button></p>
        </section>
      </main>
      <div className="login-falling-coin" aria-hidden="true">$</div>
      <footer className="login-footer">FinEdu <span>|</span> Projeto acadêmico</footer>
    </div>
  );
}
