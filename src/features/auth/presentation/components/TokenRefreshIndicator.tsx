import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../application/stores/authStore';

/**
 * Indicador visual de debug para monitorar expiração de tokens JWT.
 * Exibido apenas em ambiente de desenvolvimento.
 */
export const TokenRefreshIndicator: React.FC = () => {
  const { tokenExpiresAt, isAuthenticated } = useAuthStore();
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!isAuthenticated || !tokenExpiresAt) return;

    const interval = setInterval(() => {
      const left = Math.max(0, tokenExpiresAt - Date.now());
      setTimeLeft(Math.floor(left / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [tokenExpiresAt, isAuthenticated]);

  if (!isAuthenticated || import.meta.env.PROD) {
    return null;
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 10,
        right: 10,
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: 4,
        fontSize: 12,
        fontFamily: 'monospace',
        zIndex: 9999,
      }}
    >
      Token expira em: {minutes}m {seconds}s
    </div>
  );
};
