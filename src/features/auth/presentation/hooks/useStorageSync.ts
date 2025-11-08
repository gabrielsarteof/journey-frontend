import { useEffect } from 'react';
import { useAuthStore } from '../../application/stores/authStore';

/**
 * Fallback de sincronização usando localStorage events.
 * Utilizado quando BroadcastChannel não está disponível (Safari < 15.4).
 *
 * Storage events permitem comunicação cross-tab através de mudanças
 * no localStorage, garantindo compatibilidade com navegadores antigos.
 */
export const useStorageSync = () => {
  useEffect(() => {
    if (typeof BroadcastChannel !== 'undefined') {
      return;
    }

    console.log('[StorageSync] Usando fallback de localStorage events');

    const handleStorageChange = (event: StorageEvent) => {
      if (event.storageArea !== localStorage) return;

      switch (event.key) {
        case 'auth_token':
          if (event.newValue === null) {
            useAuthStore.getState().logout();
          } else if (event.newValue && event.oldValue !== event.newValue) {
            const refreshToken = localStorage.getItem('auth_refresh_token');
            if (refreshToken) {
              useAuthStore.setState({
                tokens: {
                  accessToken: event.newValue,
                  refreshToken,
                },
                isAuthenticated: true,
              });
            }
          }
          break;

        case 'auth_logout_trigger':
          if (event.newValue) {
            useAuthStore.getState().logout();
            localStorage.removeItem('auth_logout_trigger');
          }
          break;
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
};
