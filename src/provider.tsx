import * as React from 'react';
import { Auth0Native } from './client';
import { AuthClientContext } from './context';
import { AuthClientContextType } from './types';

export const AuthProvider: React.FC<{
  client: Auth0Native;
  scope: string;
}> = ({ children, client, scope }) => {
  const [state, setState] = React.useState<{
    isLoading: boolean;
    isAuthenticated: boolean;
  }>({
    isAuthenticated: false,
    isLoading: true,
  });

  React.useEffect(() => {
    client.isAuthenticated().then((isAuth) => {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isAuthenticated: isAuth,
      }));
    });
  }, [client]);

  const authorize: AuthClientContextType['authorize'] = async (params) => {
    const { scope: newScope, options } = params || {};

    setState((prev) => ({ ...prev, isLoading: true }));
    client
      .authorize(newScope || scope, options)
      .then(() => {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isAuthenticated: true,
        }));
      })
      .catch(() => {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isAuthenticated: false,
        }));
      });
  };

  const clearSession: AuthClientContextType['clearSession'] = async () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
    }));
    client.clearSession().then(() => {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
      }));
    });
  };

  return (
    <AuthClientContext.Provider value={{ ...state, authorize, clearSession }}>
      {children}
    </AuthClientContext.Provider>
  );
};
