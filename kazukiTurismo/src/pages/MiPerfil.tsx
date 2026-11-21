
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Navbar } from '../components/Navbar';
import { BotonAtras } from '../components/BotonAtras';
import '../styles/mi-perfil.css';

export function MiPerfil() {
  const context = useContext(AuthContext);

  if (!context || !context.user) {
    return (
      <>
        <Navbar />
        <main className="perfil-page">
          <BotonAtras />
          <p>No se encontró la información del usuario.</p>
        </main>
      </>
    );
  }

  const { user, updateUser } = context;

  const [nombres, setNombres] = useState(user.nombres);
  const [apellidos, setApellidos] = useState(user.apellidos);
  const [telefono, setTelefono] = useState(user.telefono ?? '');

  const [guardandoPerfil, setGuardandoPerfil] = useState(false);
  const [mensajePerfil, setMensajePerfil] = useState('');
  const [errorPerfil, setErrorPerfil] = useState('');

  const [passwordActual, setPasswordActual] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');

  const [guardandoPassword, setGuardandoPassword] = useState(false);
  const [mensajePassword, setMensajePassword] = useState('');
  const [errorPassword, setErrorPassword] = useState('');

  const guardarPerfil = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMensajePerfil('');
    setErrorPerfil('');

    if (!nombres.trim() || !apellidos.trim() || !telefono.trim()) {
      setErrorPerfil('Todos los campos editables son obligatorios.');
      return;
    }

    setGuardandoPerfil(true);

    try {
      const response = await authService.updateProfile({
        nombres: nombres.trim(),
        apellidos: apellidos.trim(),
        telefono: telefono.trim(),
      });

      updateUser(response.usuario);
      setMensajePerfil(response.message || 'Perfil actualizado correctamente.');
    } catch (error) {
      setErrorPerfil(
        error instanceof Error
          ? error.message
          : 'No fue posible actualizar el perfil.',
      );
    } finally {
      setGuardandoPerfil(false);
    }
  };

  const cambiarPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMensajePassword('');
    setErrorPassword('');

    if (!passwordActual || !nuevaPassword || !confirmarPassword) {
      setErrorPassword('Todos los campos de contraseña son obligatorios.');
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      setErrorPassword('Las contraseñas no coinciden.');
      return;
    }

    if (passwordActual === nuevaPassword) {
      setErrorPassword('La nueva contraseña debe ser diferente a la actual.');
      return;
    }

    setGuardandoPassword(true);

    try {
      const response = await authService.changePassword({
        passwordActual,
        nuevaPassword,
      });

      setMensajePassword(
        response.message || 'Contraseña actualizada correctamente.',
      );

      setPasswordActual('');
      setNuevaPassword('');
      setConfirmarPassword('');
    } catch (error) {
      setErrorPassword(
        error instanceof Error
          ? error.message
          : 'No fue posible cambiar la contraseña.',
      );
    } finally {
      setGuardandoPassword(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="perfil-page">
        <BotonAtras />

        <div className="perfil-header">
          <span className="perfil-icono">👤</span>
          <h1>Mi perfil</h1>
          <p>
            Consulta y actualiza tu información personal en Kazuki Turismo.
          </p>
        </div>

        <div className="perfil-contenedor">
          {/* Información personal */}
          <section className="perfil-card">
            <div className="perfil-card-header">
              <div>
                <h2>Información personal</h2>
                <p>Actualiza los datos que puedes modificar.</p>
              </div>
            </div>

            <form onSubmit={guardarPerfil}>
              <div className="perfil-grid">
                <div className="perfil-campo">
                  <label htmlFor="nombres">Nombres</label>
                  <input
                    id="nombres"
                    type="text"
                    value={nombres}
                    onChange={(e) => setNombres(e.target.value)}
                    maxLength={100}
                    required
                  />
                </div>

                <div className="perfil-campo">
                  <label htmlFor="apellidos">Apellidos</label>
                  <input
                    id="apellidos"
                    type="text"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    maxLength={100}
                    required
                  />
                </div>

                <div className="perfil-campo">
                  <label htmlFor="tipoDocumento">Tipo de documento</label>
                  <input
                    id="tipoDocumento"
                    type="text"
                    value={user.tipoDocumento}
                    readOnly
                    className="perfil-readonly"
                  />
                </div>

                <div className="perfil-campo">
                  <label htmlFor="numeroDocumento">Número de documento</label>
                  <input
                    id="numeroDocumento"
                    type="text"
                    value={user.numeroDocumento}
                    readOnly
                    className="perfil-readonly"
                  />
                </div>

                <div className="perfil-campo">
                  <label htmlFor="correo">Correo electrónico</label>
                  <input
                    id="correo"
                    type="email"
                    value={user.correo}
                    readOnly
                    className="perfil-readonly"
                  />
                </div>

                <div className="perfil-campo">
                  <label htmlFor="telefono">Teléfono</label>
                  <input
                    id="telefono"
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    maxLength={20}
                    required
                  />
                </div>

                <div className="perfil-campo">
                  <label htmlFor="rol">Tipo de usuario</label>
                  <input
                    id="rol"
                    type="text"
                    value={user.rol}
                    readOnly
                    className="perfil-readonly"
                  />
                </div>
              </div>

              {errorPerfil && (
                <div className="perfil-mensaje perfil-error" role="alert">
                  {errorPerfil}
                </div>
              )}

              {mensajePerfil && (
                <div className="perfil-mensaje perfil-exito" role="status">
                  {mensajePerfil}
                </div>
              )}

              <div className="perfil-actions">
                <button
                  type="submit"
                  className="perfil-btn perfil-btn-primary"
                  disabled={guardandoPerfil}
                >
                  {guardandoPerfil ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </section>

          {/* Cambio de contraseña */}
          <section className="perfil-card">
            <div className="perfil-card-header">
              <div>
                <h2>Seguridad</h2>
                <p>Modifica tu contraseña para proteger tu cuenta.</p>
              </div>
              <span className="perfil-icono-seguridad">🔒</span>
            </div>

            <form onSubmit={cambiarPassword}>
              <div className="perfil-password-grid">
                <div className="perfil-campo">
                  <label htmlFor="passwordActual">Contraseña actual</label>
                  <input
                    id="passwordActual"
                    type="password"
                    autoComplete="current-password"
                    value={passwordActual}
                    onChange={(e) => setPasswordActual(e.target.value)}
                    required
                  />
                </div>

                <div className="perfil-campo">
                  <label htmlFor="nuevaPassword">Nueva contraseña</label>
                  <input
                    id="nuevaPassword"
                    type="password"
                    autoComplete="new-password"
                    value={nuevaPassword}
                    onChange={(e) => setNuevaPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="perfil-campo">
                  <label htmlFor="confirmarPassword">
                    Confirmar nueva contraseña
                  </label>
                  <input
                    id="confirmarPassword"
                    type="password"
                    autoComplete="new-password"
                    value={confirmarPassword}
                    onChange={(e) => setConfirmarPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {errorPassword && (
                <div className="perfil-mensaje perfil-error" role="alert">
                  {errorPassword}
                </div>
              )}

              {mensajePassword && (
                <div className="perfil-mensaje perfil-exito" role="status">
                  {mensajePassword}
                </div>
              )}

              <div className="perfil-actions">
                <button
                  type="submit"
                  className="perfil-btn perfil-btn-secondary"
                  disabled={guardandoPassword}
                >
                  {guardandoPassword
                    ? 'Actualizando...'
                    : 'Actualizar contraseña'}
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </>
  );
}
