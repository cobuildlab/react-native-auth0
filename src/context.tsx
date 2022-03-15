/* eslint-disable @typescript-eslint/no-empty-function */
import * as React from 'react';
import { UseAuthType } from './types';

export const AuthContext = React.createContext<UseAuthType>({
  isAuthenticated: false,
  isLoading: false,
  login: () => {},
  logout: () => {},
  auth: async () => null,
});


