import { useEffect, useRef, useMemo } from 'react';
import { useAuthStore } from '../../application/stores/authStore';

type AuthSyncEvent =
  | { type: 'LOGIN'; payload: { accessToken: string; refreshToken: string; user: any } }
  | { type: 'LOGOUT'; payload: { reason?: string } }
  | { type: 'TOKEN_REFRESHED'; payload: { accessToken: string; refreshToken: string } }
  | { type: 'SESSION_EXPIRED'; payload: { message: string } };

/**
 * Hook que sincroniza estado de autenticação entre múltiplas abas/janelas
 * usando BroadcastChannel API para comunicação eficiente inter-aba.
 */
export const useMultiTabSync = () => {
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') {
      console.warn('[MultiTabSync] BroadcastChannel não suportado neste navegador');
      return;
    }

    const channel = new BroadcastChannel('journey_auth_sync');
    channelRef.current = channel;

    console.log('[MultiTabSync] Canal de sincronização iniciado');

    channel.onmessage = (event: MessageEvent<AuthSyncEvent>) => {
      const { type, payload } = event.data;

      console.log(`[MultiTabSync] Evento recebido: ${type}`, payload);

      switch (type) {
        case 'LOGIN':
          useAuthStore.setState({
            tokens: {
              accessToken: payload.accessToken,
              refreshToken: payload.refreshToken,
            },
            user: payload.user,
            isAuthenticated: true,
            error: null,
          });
          console.log('[MultiTabSync] Estado de login sincronizado');
          break;

        case 'LOGOUT':
          useAuthStore.setState({
            tokens: null,
            user: null,
            isAuthenticated: false,
            error: payload.reason || null,
          });

          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_refresh_token');

          if (!window.location.pathname.includes('/login')) {
            console.log('[MultiTabSync] Redirecionando para login após logout de outra aba');
            window.location.href = '/auth/login';
          }
          break;

        case 'TOKEN_REFRESHED':
          const currentTokens = useAuthStore.getState().tokens;

          if (
            currentTokens?.accessToken !== payload.accessToken ||
            currentTokens?.refreshToken !== payload.refreshToken
          ) {
            useAuthStore.setState({
              tokens: {
                accessToken: payload.accessToken,
                refreshToken: payload.refreshToken,
              },
            });

            localStorage.setItem('auth_token', payload.accessToken);
            localStorage.setItem('auth_refresh_token', payload.refreshToken);

            console.log('[MultiTabSync] Tokens atualizados de outra aba');
          }
          break;

        case 'SESSION_EXPIRED':
          useAuthStore.setState({
            tokens: null,
            user: null,
            isAuthenticated: false,
            error: payload.message,
          });

          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/auth/login';
          }
          break;
      }
    };

    return () => {
      console.log('[MultiTabSync] Fechando canal de sincronização');
      channel.close();
      channelRef.current = null;
    };
  }, []);

  const broadcast = useMemo(() => ({
    login: (accessToken: string, refreshToken: string, user: any) => {
      if (channelRef.current) {
        const event: AuthSyncEvent = {
          type: 'LOGIN',
          payload: { accessToken, refreshToken, user },
        };
        channelRef.current.postMessage(event);
        console.log('[MultiTabSync] Broadcast: LOGIN');
      }
    },

    logout: (reason?: string) => {
      if (channelRef.current) {
        const event: AuthSyncEvent = {
          type: 'LOGOUT',
          payload: { reason },
        };
        channelRef.current.postMessage(event);
        console.log('[MultiTabSync] Broadcast: LOGOUT');
      }
    },

    tokenRefreshed: (accessToken: string, refreshToken: string) => {
      if (channelRef.current) {
        const event: AuthSyncEvent = {
          type: 'TOKEN_REFRESHED',
          payload: { accessToken, refreshToken },
        };
        channelRef.current.postMessage(event);
        console.log('[MultiTabSync] Broadcast: TOKEN_REFRESHED');
      }
    },

    sessionExpired: (message: string) => {
      if (channelRef.current) {
        const event: AuthSyncEvent = {
          type: 'SESSION_EXPIRED',
          payload: { message },
        };
        channelRef.current.postMessage(event);
        console.log('[MultiTabSync] Broadcast: SESSION_EXPIRED');
      }
    },
  }), []);

  return broadcast;
};
