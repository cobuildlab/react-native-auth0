import * as React from 'react';
import { UseAuthType } from './types';
import { AuthContext } from './context';

export const useAuth = (): UseAuthType => {
  const context = React.useContext(AuthContext);
  return context;
};