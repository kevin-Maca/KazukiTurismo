import { useNavigate } from 'react-router-dom';

interface BotonAtrasProps {
  fallback?: string;
}

export function BotonAtras({ fallback = '/' }: BotonAtrasProps) {
  const navigate = useNavigate();

  const handleAtras = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button
      type="button"
      className="boton-atras-global"
      onClick={handleAtras}
    >
      ← Atrás
    </button>
  );
}