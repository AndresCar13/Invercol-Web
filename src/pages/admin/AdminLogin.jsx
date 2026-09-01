import { useState } from 'react';
import './Admin.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = ({ target }) => {
    setForm((current) => ({ ...current, [target.name]: target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'No fue posible iniciar sesión.');
      if (result.data?.user?.role !== 'ADMINISTRADOR') throw new Error('Esta cuenta no tiene permisos de administrador.');

      localStorage.setItem('invercol_token', result.data.token);
      localStorage.setItem('invercol_user', JSON.stringify(result.data.user));
      window.location.href = '/admin';
    } catch (loginError) {
      setError(loginError.message || 'No fue posible conectarse con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-auth-page">
      <a className="admin-back-link" href="/">← Volver al sitio</a>
      <section className="admin-auth-card">
        <span className="admin-eyebrow">INVERCOL · ADMINISTRACIÓN</span>
        <h1>Bienvenido de nuevo</h1>
        <p className="admin-intro">Ingresa para administrar las publicaciones de la inmobiliaria.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Correo electrónico</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required autoComplete="email" />

          <label htmlFor="password">Contraseña</label>
          <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required autoComplete="current-password" />

          {error && <p className="admin-error" role="alert">{error}</p>}
          <button className="admin-primary-button" disabled={loading}>{loading ? 'Ingresando…' : 'Iniciar sesión'}</button>
        </form>
      </section>
    </main>
  );
}

export default AdminLogin;
