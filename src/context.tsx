import * as React from 'react';
import { AuthClientContextType } from './types';

/**
 * @ignore
 */
const stub = (): never => {
  throw new Error('You forgot to wrap your component in <Auth0Provider>.');
};

export const AuthClientContext = React.createContext<AuthClientContextType>({
  isAuthenticated: false,
  isLoading: true,
  clearSession: stub,
  authorize: stub,
  getCredentials: stub,
});

export const useAuth = (): AuthClientContextType =>
  React.useContext(AuthClientContext);
