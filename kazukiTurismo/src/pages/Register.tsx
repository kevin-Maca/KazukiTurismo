import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/useAuth';
import { ApiError } from '../services/apiClient';
import '../styles/public.css';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '6px',
  border: '1px solid var(--border-color)',
  marginTop: '4px',
};
const labelStyle: React.CSSProperties = { fontSize: '0.85rem', fontWeight: 600 };

// El backend devuelve errores como [{ campo, mensaje }] o como string[]
function extractErrors(err: unknown): string[] {
  if (!(err instanceof ApiError)) return ['No se pudo completar el registro.'];
  const details = err.details as { errors?: unknown } | null;
  if (Array.isArray(details?.errors)) {
    return details.errors.map((item) =>
      typeof item === 'string' ? item : `${item.campo}: ${item.mensaje}`
    );
  }
  return [err.message];
}

export const Register: React.FC = () => {
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: '',
    tipoDocumento: 'CC',
    numeroDocumento: '',
    password: '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const update = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrors([]);
    setSubmitting(true);
    try {
      await register(form);
      await login(form.correo, form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setErrors(extractErrors(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '560px', margin: '3rem auto', padding: '0 1rem' }}>
        <form className="booking-form-box" onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2>Crea tu cuenta</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Nombres</label>
              <input required value={form.nombres} onChange={update('nombres')} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Apellidos</label>
              <input required value={form.apellidos} onChange={update('apellidos')} style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Correo electrónico</label>
            <input type="email" required value={form.correo} onChange={update('correo')} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Teléfono</label>
            <input type="tel" required value={form.telefono} onChange={update('telefono')}
              placeholder="3001234567" style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Tipo de documento</label>
              <select value={form.tipoDocumento} onChange={update('tipoDocumento')} style={inputStyle}>
                <option value="CC">CC</option>
                <option value="CE">CE</option>
                <option value="PASAPORTE">Pasaporte</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Número de documento</label>
              <input required value={form.numeroDocumento} onChange={update('numeroDocumento')} style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Contraseña</label>
            <input type="password" required value={form.password} onChange={update('password')} style={inputStyle} />
            <small style={{ color: 'var(--text-muted)' }}>
              Mínimo 8 caracteres, con mayúscula, minúscula y número.
            </small>
          </div>

          {errors.length > 0 && (
            <ul role="alert" style={{ color: '#C62828', margin: 0, paddingLeft: '1.2rem' }}>
              {errors.map((msg) => <li key={msg}>{msg}</li>)}
            </ul>
          )}

          <button type="submit" className="btn-primary" disabled={submitting}
            style={{ width: '100%', padding: '0.85rem' }}>
            {submitting ? 'Creando cuenta...' : 'Registrarme'}
          </button>

          <p style={{ fontSize: '0.9rem', textAlign: 'center', margin: 0 }}>
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
};