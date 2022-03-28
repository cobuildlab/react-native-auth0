import { useContext } from 'react';

import { AuthClientContext } from './context';
import { AuthClientContextType } from './types';

export const useAuth = (): AuthClientContextType =>
  useContext(AuthClientContext);
