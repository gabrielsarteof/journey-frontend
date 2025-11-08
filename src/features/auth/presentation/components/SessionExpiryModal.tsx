import { useEffect, useState } from 'react';
import { useAuthStore } from '../../application/stores/authStore';

export const SessionExpiryModal = () => {
  const { tokenExpiresAt, refreshToken, isAuthenticated } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!isAuthenticated || !tokenExpiresAt) {
      setShowModal(false);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const expiresIn = tokenExpiresAt - now;
      const twoMinutes = 2 * 60 * 1000;

      if (expiresIn > 0 && expiresIn <= twoMinutes) {
        setTimeLeft(Math.floor(expiresIn / 1000));
        setShowModal(true);
      } else {
        setShowModal(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [tokenExpiresAt, isAuthenticated]);

  const handleExtendSession = async () => {
    try {
      await refreshToken();
      setShowModal(false);
      toast.success('Sessão estendida com sucesso! 🎉');
    } catch (error) {
      toast.error('Erro ao estender sessão');
    }
  };

  if (!showModal) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface border-2 border-border-secondary rounded-2xl p-8 max-w-md w-full mx-4 shadow-lg">
        <div className="text-center">
          <div className="text-7xl mb-6 animate-pulse">⏰</div>

          <h2 className="text-2xl font-bold text-primary mb-3">
            Sua sessão está expirando
          </h2>

          <p className="text-secondary text-lg mb-6">
            Tempo restante: <span className="font-bold text-error">{minutes}:{seconds.toString().padStart(2, '0')}</span>
          </p>

          <div className="space-y-3">
            <button
              onClick={handleExtendSession}
              className="w-full bg-primary-button hover:bg-primary-button-hover text-primary-button font-bold py-4 px-6 rounded-2xl border-2 border-b-4 border-border-secondary transition-all active:translate-y-1 active:border-b-2 shadow-button-primary"
            >
              Continuar Conectado
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-surface-elevated hover:bg-surface-hover text-button-secondary font-bold py-4 px-6 rounded-2xl border-2 border-b-4 border-border-secondary transition-all active:translate-y-1 active:border-b-2 shadow-button-secondary"
            >
              Ignorar
            </button>
          </div>

          <p className="text-secondary text-sm mt-6">
            Se você não fizer nada, será desconectado automaticamente
          </p>
        </div>
      </div>
    </div>
  );
};
