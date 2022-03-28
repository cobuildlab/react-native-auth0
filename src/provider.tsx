import React, { useEffect, useState } from 'react';
import { Auth0Native } from './client';
import { AuthClientContext } from './context';
import { AuthClientContextType } from './types';

export const AuthProvider: React.FC<{
  client: Auth0Native;
  scope: string;
}> = ({ children, client, scope }) => {
  const [state, setState] = useState<{
    isLoading: boolean;
    isAuthenticated: boolean;
  }>({
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    (async () => {
      try {
        const isAuth = await client.isAuthenticated();

        setState((prev) => ({
          ...prev,
          isLoading: false,
          isAuthenticated: isAuth,
        }));
      } catch (error) {
        console.log(error);
      }
    })();
  }, [client]);

  const authorize: AuthClientContextType['authorize'] = async ({
    scope: newScope,
    options,
  }) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await client.authorize(newScope || scope, options);

      setState((prev) => ({
        ...prev,
        isLoading: false,
        isAuthenticated: true,
      }));
    } catch {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
      }));
    }
  };

  const clearSession: AuthClientContextType['clearSession'] = async () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
    }));
    console.log('logging out...');

    try {
      await client.clearSession();
    } catch (error) {
      console.log(error);
    }
    setState((prev) => ({
      ...prev,
      isLoading: false,
      isAuthenticated: false,
    }));
  };

  return (
    <AuthClientContext.Provider value={{ ...state, authorize, clearSession }}>
      {children}
    </AuthClientContext.Provider>
  );
};
